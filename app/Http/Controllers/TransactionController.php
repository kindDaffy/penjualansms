<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchTerm = $request->input('search', '');
        $status = $request->input('status', 'PENDING'); // Default to PENDING

        $orders = Order::with('items')
            ->when($status && $status != 'ALL', function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->where(function($query) use ($searchTerm) {
                $query->where('customer_first_name', 'like', '%'.$searchTerm.'%')
                    ->orWhere('customer_last_name', 'like', '%'.$searchTerm.'%')
                    ->orWhere('code', 'like', '%'.$searchTerm.'%'); // Ganti order_code menjadi code
            })
            ->get();
        
        return Inertia::render('Admin/ListTransaction', [
            'orders' => $orders, // kirim data orders ke view
            'search' => $searchTerm,
            'status' => $status,
        ]);
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
