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
        try {
            $payload = $request->all();

            Log::info('Midtrans webhook received', $payload); // Untuk debug

            $transactionStatus = $payload['transaction_status'] ?? null;
            $orderId = $payload['order_id'] ?? null;
            $paymentType = $payload['payment_type'] ?? null;
            $fraudStatus = $payload['fraud_status'] ?? null;

            if (!$orderId) {
                Log::error('Invalid order ID received', $payload); // Log error
                return response()->json(['message' => 'Invalid order ID'], 400);
            }

            // Cari order dan payment
            $order = Order::where('code', $orderId)->first();
            $payment = Payment::where('order_id', $order?->id)->first();

            if (!$order || !$payment) {
                Log::error('Order or Payment not found', ['order_id' => $orderId]); // Log error
                return response()->json(['message' => 'Order or Payment not found'], 404);
            }

            // Update status berdasarkan status transaksi
            switch ($transactionStatus) {
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
                case 'expire':
                    $order->status = Order::STATUS_CANCELLED;
                    $payment->status = 'FAILED';
                    break;

                default:
                    // Do nothing
                    Log::warning('Unknown transaction status', ['status' => $transactionStatus]);
                    break;
            }

            $order->save();
            $payment->save();

            Log::info('Webhook handled successfully', ['order_id' => $orderId]); // Log sukses
            return response()->json(['message' => 'Webhook handled'], 200);

        } catch (\Exception $e) {
            Log::error('Webhook handler error: ' . $e->getMessage(), ['exception' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
}
