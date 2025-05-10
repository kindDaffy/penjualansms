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

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        $user = auth()->user();
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->back()->with('error', 'Keranjang kosong.');
        }

        $baseTotal = $cart->items->sum(fn($item) => $item->qty * $item->price);

        // Pastikan data customer diisi sebelum menyimpan Order
        $order = Order::create([
            'user_id' => $user->id,
            'code' => Order::generateCode(),
            'status' => Order::STATUS_PENDING,
            'order_date' => now(),
            'payment_due' => now()->addDays(1),
            'base_total_price' => $baseTotal,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'grand_total' => $baseTotal,
            'customer_first_name' => $user->first_name ?? 'Default First Name', // Pastikan data ada
            'customer_last_name' => $user->last_name ?? 'Default Last Name',
            'customer_email' => $user->email ?? 'default@example.com', // Pastikan email ada
            'customer_phone' => $user->phone ?? '000000000', // Pastikan phone ada
        ]);

        // Menambahkan items ke dalam order
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
            ]);
        }

        // Midtrans payment integration
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
                'first_name' => $user->first_name,
                'email' => $user->email,
            ],
            'enabled_payments' => Payment::PAYMENT_CHANNELS,
            'expiry' => [
                'start_time' => now()->format('Y-m-d H:i:s O'),
                'unit' => Payment::EXPIRY_UNIT,
                'duration' => Payment::EXPIRY_DURATION,
            ],
        ];

        $snapToken = Snap::getSnapToken($payload);
        $order->update(['payment_url' => $snapToken]);

        return response()->json([
            'snapToken' => $snapToken,
            'order' => $order
        ]);
    }

}

?>