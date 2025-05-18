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

        $cart->recalculateTotals();

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
    }

    public function buy(Request $request)
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

        $cart->recalculateTotals();

        return redirect()->route('cart.index')->with('success', 'Produk berhasil ditambahkan dan diarahkan ke keranjang!');
    }

    public function removeItem(Request $request, $itemId)
    {
        $item = CartItem::where('id', $itemId)
            ->whereHas('cart', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->firstOrFail();

        $cart = $item->cart;
        $item->delete();

        $cart->recalculateTotals();

        return back()->with('success', 'Item berhasil dihapus dari keranjang.');
    }

    public function updateItemQty(Request $request, $itemId)
    {
        $item = CartItem::where('id', $itemId)
            ->whereHas('cart', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->firstOrFail();

        $category = $item->product->categories->first(); 
        $minQty = ($category && $category->slug == 'bbk') ? 5 : 1;

        $request->validate([
            'qty' => "required|integer|min:$minQty",
        ]);

        $item->qty = $request->qty;
        $item->save();

        $cart = $item->cart;
        $cart->recalculateTotals();

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

        if ($coupon->quota <= 0) {
            return back()->withErrors(['code' => 'Kupon tidak tersedia']);
        }

        $used = CouponUsage::where('user_id', $user->id)
            ->where('coupon_id', $coupon->id)
            ->exists();

        if ($used) {
            return back()->withErrors(['code' => 'Kupon ini sudah pernah digunakan']);
        }

        $discount = 0;
        if ($coupon->discount_amount) {
            $discount = $coupon->discount_amount;
        } elseif ($coupon->discount_percent) {
            $discount = $cart->base_total_price * ($coupon->discount_percent / 100);
        }

        $cart->update([
            'coupon_id' => $coupon->id,
            'discount_amount' => $discount,
            'discount_percent' => $coupon->discount_percent ?? 0,
            'grand_total' => max(0, $cart->base_total_price - $discount),
        ]);

        CouponUsage::create([
            'user_id' => $user->id,
            'coupon_id' => $coupon->id,
        ]);

        $coupon->decrement('quota');

        return back()->with('success', 'Kupon berhasil diterapkan!');
    }

    public function removeCoupon(Request $request)
    {
        $user = auth()->user();
        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart->coupon_id) {
            $couponId = $cart->coupon_id;
            
            CouponUsage::where('user_id', $user->id)
                ->where('coupon_id', $cart->coupon_id)
                ->delete();

            Coupon::where('id', $couponId)->increment('quota');

            $cart->update([
                'coupon_id' => null,
                'discount_amount' => 0,
                'discount_percent' => 0,
                'grand_total' => $cart->base_total_price,
            ]);
        }

        return back()->with('success', 'Kupon berhasil dibatalkan.');
    }
}
