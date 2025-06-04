<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->all();
        Log::info('Midtrans webhook received', $payload);

        // Validasi Signature Key
        $serverKey = config('midtrans.server_key');

        $expectedSignature = hash('sha512',
            $payload['order_id'] .
            $payload['status_code'] .
            $payload['gross_amount'] .
            $serverKey
        );

        if (($payload['signature_key'] ?? '') !== $expectedSignature) {
            Log::warning('Invalid signature key', $payload);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // Cari order dan payment
        $orderId = urldecode($payload['order_id'] ?? '');
        $order = Order::where('code', $orderId)->first();
        $payment = Payment::where('order_id', $order?->id)->first();

        if (!$order || !$payment) {
            Log::error('Order or Payment not found', ['order_id' => $payload['order_id'] ?? null]);
            return response()->json(['message' => 'Order or Payment not found'], 404);
        }

        // Update status berdasarkan status transaksi
        switch ($payload['transaction_status']) {
            case 'capture':
            case 'settlement':
                $order->status = Order::STATUS_CONFIRMED;
                $payment->status = 'PAID';
                break;

            case 'pending':
                $order->status = Order::STATUS_PENDING;
                $payment->status = 'PENDING';
                break;

            case 'deny':
            case 'cancel':
                $order->status = Order::STATUS_CANCELLED;
                $payment->status = 'CANCELLED';
                break;
            case 'expire':
                $order->status = Order::STATUS_CANCELLED;
                $payment->status = 'FAILED';
                break;

            default:
                Log::warning('Unknown transaction status', ['status' => $payload['transaction_status']]);
                break;
        }

        $order->save();
        $payment->save();

        Log::info('Webhook handled successfully', ['order_id' => $order->code]);
        Log::info('ORDER FOUND:', [$order->id, $order->code]);
        Log::info('PAYMENT FOUND:', [$payment->id ?? 'not-found']);

        return response()->json(['message' => 'Webhook handled'], 200);
    }
}