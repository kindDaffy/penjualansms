<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */    

    // Bagian Admin
 public function index(Request $request)
    {
        $search = $request->query('search');
        
        // Hanya ambil produk yang TIDAK di-soft delete (active products)
        $products = Product::with('user', 'inventory')
            ->whereNull('deleted_at') // Filter untuk produk aktif
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                             ->orWhere('sku', 'like', "%{$search}%");
            })
            ->orderBy('sku', 'asc')
            ->get() // Menggunakan get() karena pagination di frontend
            ->map(function ($product) {
                $qty = $product->inventory->qty ?? 0; 
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'status' => $product->status,
                    'stock_status' => $product->stock_status,
                    'stock_qty' => $qty,
                    'featured_image' => $product->featured_image_url, // Menggunakan accessor
                ];
            });
        
        return Inertia::render('Admin/ListProduct', [
            'products' => $products,
            'search' => $search,
            'success' => session('success'),
        ]);
    }

    /**
     * Display a listing of the soft-deleted resources (Product Archive).
     */
    public function archive(Request $request)
    {
        $search = $request->query('search');

        // Ambil produk yang HANYA di-soft delete (archived products)
        $products = Product::onlyTrashed()
            ->with('user', 'inventory')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                             ->orWhere('sku', 'like', "%{$search}%");
            })
            ->orderBy('sku', 'asc')
            ->get() // Menggunakan get() karena pagination di frontend
            ->map(function ($product) {
                $qty = $product->inventory->qty ?? 0;
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'status' => $product->status,
                    'stock_status' => $product->stock_status,
                    'stock_qty' => $qty,
                    'featured_image' => $product->featured_image_url, // Menggunakan accessor
                    'deleted_at' => $product->deleted_at ? $product->deleted_at->format('Y-m-d H:i:s') : null, // Waktu soft delete
                ];
            });

        return Inertia::render('Admin/ProductArchive', [
            'products' => $products,
            'search' => $search,
            'success' => session('success'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Untuk create, kita mungkin ingin mengirim daftar kategori
        $categories = Category::all();
        return Inertia::render('Products/Create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku'           => 'required|string|max:255|unique:shop_products,sku',
            'name'          => 'required|string',
            'type'          => 'required|string|max:255',
            'status'        => 'required|in:' . implode(',', array_keys(Product::STATUSES)),
            'price'         => 'nullable|numeric|min:0', // Ini nullable karena diset di edit
            'sale_price'    => 'nullable|numeric|min:0', // Ini nullable karena diset di edit
            // category_id, qty, low_stock_threshold, image tidak di sini karena diset di edit
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
        
        $product = Product::withTrashed()->with('inventory', 'categories')->findOrFail($id);
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
        DB::beginTransaction(); // Mulai transaksi database
        try {
            // Ambil produk baik yang aktif maupun yang di-soft delete
            $product = Product::withTrashed()->with('inventory')->findOrFail($id);
            $request->merge([
                'manage_stock' => filter_var($request->manage_stock, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false
            ]);         

            $validated = $request->validate([
                'sku' => 'required|string|max:255|unique:shop_products,sku,' . $product->id,
                'name'           => 'required',
                'type'           => 'required|string|max:255',
                'price'          => 'required|numeric|min:0', // price sekarang required di update
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
                // Hapus gambar lama jika ada dan bukan gambar seeder
                // Cek apakah path yang disimpan di DB dimulai dengan 'images/' (dari seeder)
                if ($product->featured_image && !Str::startsWith($product->featured_image, 'images/')) {
                    Storage::disk('public')->delete($product->featured_image);
                }
                $imagePath = $request->file('image')->store('product-images', 'public');
                $validated['featured_image'] = $imagePath;
            }
            
            $product->update($validated);

            // Sync kategori yang dipilih untuk produk
            // Perbaikan logika sync kategori
            // Jika category_id dikirim dan tidak kosong
            if (!empty($request->category_id)) {
                $product->categories()->sync([$request->category_id]);
            } else {
                // Jika category_id tidak dikirim atau kosong, hapus semua kategori terkait
                $product->categories()->detach();
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
                $product->inventory()->delete(); // Hapus entri inventaris jika manage_stock false
            }         

            DB::commit(); // Commit transaksi jika semua berhasil
            return redirect()->route('products.index')->with('success', 'Product updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaksi jika terjadi kesalahan
            // Log error untuk debugging
            \Log::error('Error updating product: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            // Redirect dengan pesan error
            return redirect()->back()->withErrors(['message' => 'Gagal memperbarui produk: ' . $e->getMessage()]);
        }
    }

    /**
     * Soft Delete the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Hapus relasi kategori produk
        $product->categories()->detach();

        // Lakukan soft delete
        $product->delete(); // Ini akan mengisi kolom deleted_at

        return redirect()->route('products.index')->with('success', 'Produk berhasil diarsipkan.');
    }

    /**
     * Restore the specified soft-deleted resource.
     */
    public function restore($id)
    {
        $product = Product::onlyTrashed()->findOrFail($id); // Ambil hanya yang di-soft delete
        $product->restore(); // Lakukan restore

        return redirect()->route('products.archive')->with('success', 'Produk berhasil dikembalikan.');
    }

    /**
     * Permanently remove the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $product = Product::onlyTrashed()->findOrFail($id); // Ambil hanya yang di-soft delete
        
        // Hapus relasi kategori produk
        $product->categories()->detach();

        // Hapus gambar fisik secara permanen
        if ($product->featured_image) {
            // Cek apakah path gambar dari folder public (seeder)
            if (Str::startsWith($product->featured_image, 'images/')) {
                $fullPath = public_path($product->featured_image);
                if (file_exists($fullPath)) {
                    unlink($fullPath); // Hapus file dari public/images
                }
            } else {
                // Jika dari storage/app/public, hapus melalui Storage facade
                Storage::disk('public')->delete($product->featured_image);
            }
        }
        // Hapus gambar tambahan jika ada (misal dari relasi ProductImage)
        foreach ($product->images as $image) {
            // Asumsi image->name adalah path relatif dari storage/app/public atau public/images
            // Anda perlu logic serupa untuk images() jika path-nya bisa bervariasi
            Storage::disk('public')->delete($image->name); 
            $image->delete(); // Hapus entri dari ProductImages table
        }

        $product->forceDelete(); // Hapus permanen dari database

        return redirect()->route('products.archive')->with('success', 'Produk berhasil dihapus permanen.');
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
            ->leftJoin('shop_product_inventories', 'shop_product_inventories.product_id', '=', 'shop_products.id')
            ->select('shop_products.*') // penting agar pagination tetap bekerja
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('shop_products.name', 'like', "%{$search}%")
                    ->orWhere('shop_products.sku', 'like', "%{$search}%");
                });
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
            // Urutkan stok dulu
            ->orderByRaw('(shop_product_inventories.qty = 0) asc')
            // Sorting tambahan dari user
            ->when($sort && $sort !== 'default', function ($query) use ($sort) {
                if ($sort === 'ascending') {
                    $query->orderBy('shop_products.name', 'asc');
                } elseif ($sort === 'descending') {
                    $query->orderBy('shop_products.name', 'desc');
                } elseif ($sort === 'price-asc') {
                    $query->orderBy('shop_products.price', 'asc');
                } elseif ($sort === 'price-dsc') {
                    $query->orderBy('shop_products.price', 'desc');
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
            'search' => $search ?? '',
            'selectedCategory' => $categorySlug,
            'categories' => $categories,
            'sort' => $sort ?? 'default',
        ]);
    }

    public function show_product_bbk(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 6);
        $sort = $request->query('sort');

        $products = Product::query()
            ->leftJoin('shop_product_inventories', 'shop_product_inventories.product_id', '=', 'shop_products.id')
            ->select('shop_products.*')
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('shop_products.name', 'like', "%{$search}%")
                    ->orWhere('shop_products.sku', 'like', "%{$search}%");
                });
            })
            ->whereHas('categories', function ($query) {
                $query->where('slug', 'like', 'bbk%');
            })
            ->orderByRaw('(shop_product_inventories.qty = 0) asc')
            ->when($sort && $sort !== 'default', function ($query) use ($sort) {
                if ($sort === 'ascending') {
                    $query->orderBy('shop_products.name', 'asc');
                } elseif ($sort === 'descending') {
                    $query->orderBy('shop_products.name', 'desc');
                } elseif ($sort === 'price-asc') {
                    $query->orderBy('shop_products.price', 'asc');
                } elseif ($sort === 'price-dsc') {
                    $query->orderBy('shop_products.price', 'desc');
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

        return Inertia::render('Customer/BahanBakarKhusus', [
            'products' => $products,
            'search' => $search,
            'sort' => $sort,
        ]);
    }
}

