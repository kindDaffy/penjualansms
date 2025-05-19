<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get the latest confirmed orders
        $recentOrders = Order::select(
                'customer_first_name', 
                'customer_last_name', 
                'customer_email', 
                'base_total_price',
                'order_date'
            )
            ->where('status', Order::STATUS_CONFIRMED)
            ->orderBy('order_date', 'desc')
            ->take(5)
            ->get();

        // Count orders by status
        $orderStats = [
            'unpaid' => Order::where('status', Order::STATUS_PENDING)->count(),
            'paid' => Order::where('status', Order::STATUS_CONFIRMED)->count(),
            'completed' => Order::where('status', Order::STATUS_COMPLETED)->count(),
            'cancelled' => Order::where('status', Order::STATUS_CANCELLED)->count(),
        ];

        // Get current year and month
        $currentYear = Carbon::now()->year;
        
        // Calculate revenue by month for the current year
        $revenueData = [];
        
        // Get monthly revenue data
        $monthlyRevenue = DB::table('shop_orders')
            ->select(
                DB::raw('MONTH(order_date) as month'),
                DB::raw('SUM(base_total_price) as total_revenue')
            )
            ->where('status', Order::STATUS_CONFIRMED)
            ->whereYear('order_date', $currentYear)
            ->groupBy(DB::raw('MONTH(order_date)'))
            ->orderBy('month')
            ->get();
            
        // Initialize all months with 0 revenue
        $months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        foreach ($months as $index => $monthName) {
            $revenueData[] = [
                'month' => $monthName,
                'revenue' => 0
            ];
        }
        
        // Fill in actual revenue data for months that have sales
        foreach ($monthlyRevenue as $revenue) {
            $monthIndex = $revenue->month - 1; // Convert to 0-based index
            if (isset($revenueData[$monthIndex])) {
                $revenueData[$monthIndex]['revenue'] = round($revenue->total_revenue, 2);
            }
        }
        
        // Calculate the total revenue for the year
        $totalRevenue = array_sum(array_column($revenueData, 'revenue'));
        
        // Calculate the trend percentage by comparing current month with previous month
        $currentMonth = Carbon::now()->month;
        $previousMonth = $currentMonth == 1 ? 12 : $currentMonth - 1;
        
        $currentMonthRevenue = $currentMonth <= count($revenueData) ? $revenueData[$currentMonth - 1]['revenue'] : 0;
        $previousMonthRevenue = $previousMonth <= count($revenueData) ? $revenueData[$previousMonth - 1]['revenue'] : 0;
        
        $trendingPercentage = 0;
        if ($previousMonthRevenue > 0) {
            $trendingPercentage = round((($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100, 1);
        }
        
        // Send data to admin dashboard view
        return Inertia::render('AdminDashboard', [
            'recentOrders' => $recentOrders,
            'orderStats' => $orderStats,
            'revenueData' => $revenueData,
            'totalRevenue' => $totalRevenue,
            'trendingPercentage' => $trendingPercentage,
            'currentYear' => $currentYear
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
