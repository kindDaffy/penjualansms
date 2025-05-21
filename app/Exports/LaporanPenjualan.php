<?php

namespace App\Exports;

use App\Models\Order;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use Carbon\Carbon;

class LaporanPenjualan implements FromView, WithStyles, ShouldAutoSize, WithTitle
{
    protected $month;
    protected $year;

    public function __construct($month, $year)
    {
        $this->month = $month;
        $this->year = $year;
    }

    public function view(): View
    {
        // Filter orders by month and year
        $startDate = Carbon::createFromDate($this->year, $this->month, 1)->startOfMonth();
        $endDate = Carbon::createFromDate($this->year, $this->month, 1)->endOfMonth();

        $orders = Order::with('items')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('status', Order::STATUS_COMPLETED)
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

        return view('laporan-penjualan', [
            'reportData' => $reportData,
            'month' => $startDate->format('F'),
            'year' => $this->year,
        ]);
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function title(): string
    {
        $monthName = Carbon::createFromDate($this->year, $this->month, 1)->format('F');
        return "Laporan Penjualan {$monthName} {$this->year}";
    }
}