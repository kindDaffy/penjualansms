<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::with(['items.product'])->where('user_id', auth()->id())->first();

        return Inertia::render('Customer/Cart', [
            'cart' => $cart,
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'exists:shop_products,id'],
            'qty' => ['required', 'integer', 'min:1'],
        ]);

        $user = auth()->user();

        // Ambil cart aktif user, atau buat baru
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['expired_at' => now()->addDays(7)]
        );

        $product = Product::findOrFail($request->product_id);

        // Cek apakah produk sudah ada dalam cart
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            // Jika sudah ada, tambahkan qty
            $cartItem->qty += $request->qty;
            $cartItem->save();
        } else {
            // Jika belum ada, buat item baru
            $cart->items()->create([
                'product_id' => $product->id,
                'qty' => $request->qty,
                'price' => $product->price, // kamu bisa tambahkan kolom ini di migration jika belum
            ]);
        }

        // Recalculate total cart
        $baseTotal = $cart->items->sum(function ($item) {
            return $item->qty * $item->price;
        });

        $cart->update([
            'base_total_price' => $baseTotal,
            'tax_amount' => 0, // bisa kamu hitung juga kalau sudah punya logic pajak
            'discount_amount' => 0, // atau diskon
            'grand_total' => $baseTotal,
        ]);

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
    }


    public function removeItem(Request $request, $itemId)
    {
        $item = CartItem::where('id', $itemId)
            ->whereHas('cart', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->firstOrFail();

        $item->delete();

        return back()->with('success', 'Item berhasil dihapus dari keranjang.');
    }

    public function updateItemQty(Request $request, $itemId)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $item = CartItem::where('id', $itemId)
            ->whereHas('cart', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->firstOrFail();

        $item->qty = $request->qty;
        $item->save();

        return back()->with('success', 'Jumlah item berhasil diperbarui.');
    }
}
