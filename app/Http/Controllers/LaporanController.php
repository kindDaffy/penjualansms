<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Exports\LaporanPenjualan;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class LaporanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/LaporanAdmin', [
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'bulan' => 'required|string|size:2',
            'tahun' => 'required|string|size:4',
        ]);

        $month = $request->bulan;
        $year = $request->tahun;
        
        $fileName = "laporan_penjualan_{$month}_{$year}.xlsx";

        return Excel::download(new LaporanPenjualan($month, $year), $fileName);
    }
    
    public function print(Request $request)
    {
        $request->validate([
            'bulan' => 'required|string|size:2',
            'tahun' => 'required|string|size:4',
        ]);

        $month = $request->bulan;
        $year = $request->tahun;
        
        // Filter orders by month and year
        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();

        $orders = \App\Models\Order::with('items')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('status', \App\Models\Order::STATUS_COMPLETED)
            ->get();


        // Prepare data for the report
        $reportData = [];
        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $reportData[] = [
                    'tanggal_beli' => $order->created_at->format('d-m-Y'),
                    'nama' => $order->customer_first_name . ' ' . $order->customer_last_name,
                    'email' => $order->customer_email,
                    'barang' => $item->name,
                    'quantity' => $item->qty,
                    'total_harga' => $item->sub_total,
                    'order_code' => $order->code,
                ];
            }
        }
        
        $monthName = Carbon::createFromDate($year, $month, 1)->locale('id')->monthName;
        
        return view('laporan-print', [
            'reportData' => $reportData,
            'month' => $monthName,
            'year' => $year,
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
