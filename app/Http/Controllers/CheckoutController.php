<?php 

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        $user = auth()->user();
        $cart = Cart::with('items.product.inventory')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->back()->with('error', 'Keranjang kosong.');
        }

        DB::beginTransaction();

        try {
            foreach ($cart->items as $item) {
                $availableQty = $item->product->inventory->qty ?? 0;
                if ($item->qty > $availableQty) {
                    return response()->json([
                        'error' => "Stok untuk {$item->product->name} tidak mencukupi. Sisa stok: {$availableQty}",
                    ], 422);
                }
            }

            $baseTotal = $cart->base_total_price;
            $discountAmount = $cart->discount_amount;
            $grandTotal = $cart->grand_total;

            $order = Order::create([
                'user_id' => $user->id,
                'code' => Order::generateCode(),
                'status' => Order::STATUS_PENDING,
                'coupon_id' => $cart->coupon_id,
                'order_date' => now(),
                'payment_due' => now()->addDays(1),
                'base_total_price' => $baseTotal,
                'discount_amount' => $discountAmount,
                'tax_amount' => 0,
                'grand_total' => $grandTotal,
                'customer_first_name' => explode(' ', $user->name)[0],
                'customer_last_name' => explode(' ', $user->name)[1] ?? '',
                'customer_email' => $user->email ?? 'guest@example.com',
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'qty' => $item->qty,
                    'base_price' => $item->price,
                    'base_total' => $item->qty * $item->price,
                    'sub_total' => $item->qty * $item->price,
                    'name' => $item->product->name,
                    'sku' => $item->product->sku,
                    'type' => $item->product->type,
                    'attributes' => $item->product->attributes,
                    'use_jerigen' => $item->use_jerigen,
                ]);

                $inventory = $item->product->inventory;
                if ($inventory) {
                    $inventory->decrement('qty', $item->qty);
                }
            }

            // Midtrans Setup
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = config('midtrans.is_production');
            Config::$isSanitized = config('midtrans.is_sanitized');
            Config::$is3ds = config('midtrans.is_3ds');

            $payload = [
                'transaction_details' => [
                    'order_id' => $order->code,
                    'gross_amount' => $order->grand_total,
                ],
                'customer_details' => [
                    'first_name' => explode(' ', $user->name)[0],
                    'email' => $user->email,
                ],
                'enabled_payments' => Payment::PAYMENT_CHANNELS,
                'expiry' => [
                    'start_time' => now()->format('Y-m-d H:i:s O'),
                    'unit' => Payment::EXPIRY_UNIT,
                    'duration' => Payment::EXPIRY_DURATION,
                ],
            ];

            $midtransTransaction = Snap::createTransaction($payload);

            Payment::create([
                'user_id' => $user->id,
                'order_id' => $order->id,
                'payment_type' => 'midtrans',
                'status' => 'PENDING',
                'amount' => $order->grand_total,
                'token' => $midtransTransaction->token,
                'redirect_url' => $midtransTransaction->redirect_url,
                'payloads' => json_encode($payload),
            ]);

            $order->update(['payment_url' => $midtransTransaction->redirect_url]);

            // Kosongkan keranjang
            $cart->items()->delete();
            $cart->update([
                'coupon_id' => null,
                'discount_amount' => 0,
                'discount_percent' => 0,
                'base_total_price' => 0,
                'grand_total' => 0,
            ]);

            DB::commit();

            return response()->json([
                'snapToken' => $midtransTransaction->token,
                'redirectUrl' => $midtransTransaction->redirect_url,
                'order' => $order
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            report($e);
            return response()->json(['error' => 'Checkout gagal, silakan coba lagi.'], 500);
        }
    }

    public function history()
    {
        $user = auth()->user();

        $orders = Order::with('items.product')
            ->where('user_id', $user->id)
            ->whereIn('status', [
                Order::STATUS_CONFIRMED,
                Order::STATUS_COMPLETED,
                Order::STATUS_CANCELLED,
            ])
            ->orderBy('order_date', 'desc')
            ->get();

        return Inertia::render('Customer/OrderHistory', [
            'orders' => $orders,
        ]);
    }
}

?>