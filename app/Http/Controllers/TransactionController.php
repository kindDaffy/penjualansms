<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Inertia\Inertia;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchTerm = $request->input('search', '');
        $status = $request->input('status', 'PENDING');

        // Pastikan relasi 'items' dan 'product' di dalam 'items' dimuat
        $orders = Order::with('items.product') // <-- PENTING: tambahkan .product di sini
            ->when($status && $status != 'ALL', function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->where(function($query) use ($searchTerm) {
                $query->where('customer_first_name', 'like', '%'.$searchTerm.'%')
                    ->orWhere('customer_last_name', 'like', '%'.$searchTerm.'%')
                    ->orWhere('code', 'like', '%'.$searchTerm.'%');
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'no' => $order->code,
                    'full_name' => $order->customer_first_name . ' ' . $order->customer_last_name,
                    'total' => $order->grand_total, // Menggunakan grand_total dari model Order
                    'status' => $order->status,
                    'order_date' => Carbon::parse($order->created_at)->format('Y-m-d H:i:s'),
                    // Sertakan detail item untuk modal
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_name' => $item->product ? $item->product->name : 'Produk tidak ditemukan', // Cek keberadaan produk
                            'qty' => $item->qty,
                            'price' => $item->price,
                            'sub_total' => $item->sub_total,
                        ];
                    }),
                ];
            });
        
        return Inertia::render('Admin/ListTransaction', [
            'orders' => $orders,
            'search' => $searchTerm,
            'status' => $status,
        ]);
    }

    public function complete(Order $order)
    {
        try {
            // Update status order menjadi COMPLETED
            $order->status = 'COMPLETED';
            $order->save();
             
            return redirect()->back()->with('success', 'Transaction has been completed successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to complete transaction: ' . $e->getMessage());
        }
    }
    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
