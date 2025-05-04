<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::with(['items.product', 'coupon'])->where('user_id', auth()->id())->first();

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

        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['expired_at' => now()->addDays(7)]
        );

        $product = Product::findOrFail($request->product_id);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $cartItem->qty += $request->qty;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'qty' => $request->qty,
                'price' => $product->price,
            ]);
        }

        $baseTotal = $cart->items->sum(function ($item) {
            return $item->qty * $item->price;
        });

        $cart->update([
            'base_total_price' => $baseTotal,
            'tax_amount' => 0, 
            'discount_amount' => 0, 
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

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => ['required', 'exists:shop_coupons,code'],
        ], [
            'code.exists' => 'Kode kupon tidak ditemukan.',
        ]);               

        $user = auth()->user();
        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return back()->withErrors(['code' => 'Kode kupon tidak valid']);
        }

        // Cek apakah user sudah pernah pakai kupon ini
        $used = CouponUsage::where('user_id', $user->id)
            ->where('coupon_id', $coupon->id)
            ->exists();

        if ($used) {
            return back()->withErrors(['code' => 'Kupon ini sudah pernah digunakan']);
        }

        // Hitung diskon
        $discount = 0;

        if ($coupon->discount_amount) {
            $discount = $coupon->discount_amount;
        } elseif ($coupon->discount_percent) {
            $discount = $cart->base_total_price * ($coupon->discount_percent / 100);
        }


        // Update cart
        $cart->update([
            'discount_amount' => $discount,
            'discount_percent' => $coupon->discount_percent ?? 0,
            'grand_total' => max(0, $cart->base_total_price - $discount), // jangan sampai minus
            'coupon_id' => $coupon->id,
        ]);

        // Simpan penggunaan kupon
        CouponUsage::create([
            'user_id' => $user->id,
            'coupon_id' => $coupon->id,
        ]);

        return back()->with('success', 'Kupon berhasil diterapkan!');
    }
}
