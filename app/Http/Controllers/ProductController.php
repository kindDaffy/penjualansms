<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */    

    // Bagian Admin
    public function index(Request $request)
    {
        $search = $request->query('search'); // Ambil nilai pencarian dari query string
    
        $products = Product::with('user')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                             ->orWhere('sku', 'like', "%{$search}%");
            })
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'status' => $product->status,
                    'stock_status' => $product->stock_status,
                    'featured_image' => $product->featured_image_url, // Gunakan accessor
                ];
            });
    
        return Inertia::render('Admin/ListProduct', [
            'products' => $products,
            'search' => $search, // Kirim search term ke frontend
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::all();

        return Inertia::render('Products/Create', compact('products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku'          => 'required|string|max:255|unique:shop_products,sku',
            'name'         => 'required|string',
            'type'         => 'required|string|max:255', // Menambahkan validasi untuk type
            'status' => 'required|in:' . implode(',', array_keys(Product::STATUSES)),
        ]);
    
        $validated['slug'] = Str::slug($request->name);
        $validated['user_id'] = auth()->user()->id;
    
        $product = Product::create($validated);
    
        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        
        $product = Product::with('inventory', 'categories')->findOrFail($id);
        $categories = Category::all();
        $product->featured_image_url = $product->featured_image ? asset("storage/{$product->featured_image}") : null;
        return Inertia::render('Admin/EditProduct', [
            'product' => $product,
            'categories' => $categories,
            
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::with('inventory')->findOrFail($id);
        $request->merge([
            'manage_stock' => filter_var($request->manage_stock, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false
        ]);        

        $validated = $request->validate([
            'sku' => 'required|string|max:255|unique:shop_products,sku,' . $product->id,
            'name'           => 'required',
            'type'           => 'required|string|max:255', // Tambahkan validasi type
            'price'          => 'required|numeric|min:0',
            'sale_price'     => 'nullable|numeric|min:0',
            'status'         => 'required|in:' . implode(',', array_keys(Product::STATUSES)),
            'stock_status'   => 'required|in:' . implode(',', array_keys(Product::STOCK_STATUSES)),
            'excerpt'        => 'nullable|string',
            'body'           => 'nullable|string',
            'image'          => 'nullable|image|mimes:jpeg,png,jpg|max:4096|min:50',
            'manage_stock'   => 'required|boolean',
            'category_id' => 'nullable|exists:shop_categories,id', // Validasi kategori
            'qty'            => $request->manage_stock ? 'required|integer|min:0' : 'nullable|integer|min:0',
            'low_stock_threshold' => $request->manage_stock ? 'required|integer|min:0' : 'nullable|integer|min:0',

        ]);
        $validated['slug'] = Str::slug($request->name);

        // Simpan gambar baru
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('product-images', 'public');
            $validated['featured_image'] = $imagePath;
        }
        
        $product->update($validated);

        // Sync kategori yang dipilih untuk produk
        if ($request->has('category_id')) {
            $product->categories()->sync([$request->category_id]);  // Menyinkronkan kategori yang dipilih
        }

        if ($request->manage_stock) {
            $product->inventory()->updateOrCreate(
                ['product_id' => $product->id],
                [
                    'qty' => $request->qty ?? 0, 
                    'low_stock_threshold' => $request->low_stock_threshold ?? 0
                ]
            );
        } else {
            $product->inventory()->delete();
        }        

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
    // Hapus relasi kategori produk
    $product->categories()->detach();

    // Hapus gambar produk, pastikan gambar ada
    if ($product->featured_image) {
        // Hapus gambar dari storage
        Storage::disk('public')->delete($product->featured_image);
    }

    // Hapus relasi produk dengan tabel lain jika ada (misalnya shop_products_tags, images, dll)
    foreach ($product->images as $image) {
        Storage::disk('public')->delete($image->name); // Hapus file gambar
        $image->delete(); // Hapus entri gambar dari database
    }

    // Hapus produk
    $product->delete();

    return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }


    public function toggleManageStock(Request $request, Product $product)
    {
        $product->manage_stock = !$product->manage_stock;
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Manage stock updated successfully',
            'manage_stock' => $product->manage_stock
        ]);
    }

    // Bagian Customer
    public function show_product_oli(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 9);
        $categorySlug = $request->query('category');
        $sort = $request->query('sort');

        $products = Product::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })
            ->when($categorySlug, function ($query, $slug) {
                $query->whereHas('categories', function ($q) use ($slug) {
                    $q->where('slug', $slug);
                });
            }, function ($query) {
                $query->whereHas('categories', function ($q) {
                    $q->where('slug', 'like', 'oli%');
                });
            })
            ->when($sort && $sort !== 'default', function ($query) use ($sort) {
                if ($sort === 'ascending') {
                    $query->orderBy('name', 'asc');
                } elseif ($sort === 'descending') {
                    $query->orderBy('name', 'desc');
                } elseif ($sort === 'price-asc') {
                    $query->orderBy('price', 'asc');
                } elseif ($sort === 'price-dsc') {
                    $query->orderBy('price', 'desc');
                }
            })  
            ->paginate($perPage)
            ->withQueryString()
            ->through(function ($product) {
                $qty = $product->inventory->qty ?? 0;
                $low = $product->inventory->low_stock_threshold ?? 0;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'status' => $product->status,
                    'body' => $product->body,
                    'excerpt' => $product->excerpt,
                    'featured_image' => $product->featured_image_url,
                    'stock_qty' => $qty,
                    'low_stock_threshold' => $low,
                    'stock_status' => $qty == 0 ? 'out' : ($qty <= $low ? 'low' : 'available'),
                ];
            });

        $categories = Category::where('slug', 'like', 'oli-%')->get();

        return Inertia::render('Customer/OliMesin', [
            'products' => $products,
            'search' => $search,
            'selectedCategory' => $categorySlug,
            'categories' => $categories,
            'sort' => $sort, 
        ]);
    }

    public function show_product_bbk(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 6);

        $products = Product::query()
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%");
            })
            ->whereHas('categories', function($query) {
                $query->where('slug', 'like', 'bbk%');
            })

            ->paginate($perPage)
            ->withQueryString()
            ->through(function ($product) {
                $qty = $product->inventory->qty ?? 0;
                $low = $product->inventory->low_stock_threshold ?? 0;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'status' => $product->status,
                    'body' => $product->body,
                    'excerpt' => $product->excerpt,
                    'featured_image' => $product->featured_image_url,
                    'stock_qty' => $qty,
                    'low_stock_threshold' => $low,
                    'stock_status' => $qty == 0 ? 'out' : ($qty <= $low ? 'low' : 'available'),
                ];
            });

        return Inertia::render('Customer/BahanBakarKhusus', [
            'products' => $products,
            'search' => $search,
        ]);
    }
}

