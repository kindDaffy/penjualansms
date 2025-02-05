<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('categories', 'user')->get();
        $categories = Category::all();

        return Inertia::render('Admin/ListProduct', [
            'products' => $products,
            'categories' => $categories,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255|unique:shop_products,name',
            'price'          => 'required|numeric|min:0',
            'sale_price'     => 'nullable|numeric|min:0',
            'status'         => 'required|in:' . implode(',', array_keys(Product::STATUSES)),
            'stock_status'   => 'required|in:' . implode(',', array_keys(Product::STOCK_STATUSES)),
            'categories'     => 'nullable|array',
            'categories.*'   => 'exists:shop_categories,id',
        ]);

        $validated['slug'] = Str::slug($request->name);
        $validated['user_id'] = auth()->id();

        $product = Product::create($validated);

        if ($request->has('categories')) {
            $product->categories()->sync($validated['categories']);
        }

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::all();

        return Inertia::render('Products/Edit', [
            'product' => $product->load('categories'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255|unique:shop_products,name,' . $product->id,
            'price'          => 'required|numeric|min:0',
            'sale_price'     => 'nullable|numeric|min:0',
            'status'         => 'required|in:' . implode(',', array_keys(Product::STATUSES)),
            'stock_status'   => 'required|in:' . implode(',', array_keys(Product::STOCK_STATUSES)),
            'categories'     => 'nullable|array',
            'categories.*'   => 'exists:shop_categories,id',
        ]);

        $validated['slug'] = Str::slug($request->name);

        $product->update($validated);

        if ($request->has('categories')) {
            $product->categories()->sync($validated['categories']);
        }

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}

