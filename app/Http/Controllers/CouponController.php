<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\CouponUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $coupons = Coupon::query()
            ->when($search, function ($query, $search) {
                return $query->where('code', 'like', "%{$search}%");
            })
            ->with(['users' => function ($query) {
                $query->select('users.id', 'users.name', 'users.email');
            }])
            ->get()
            ->map(function ($coupon) {
                return [
                    'id' => $coupon->id,
                    'code' => $coupon->code,
                    'discount_percent' => $coupon->discount_percent,
                    'discount_amount' => $coupon->discount_amount,
                    'valid_until' => $coupon->valid_until ? Carbon::parse($coupon->valid_until)->format('Y-m-d') : null,
                    'quota' => $coupon->quota,
                    'usage_count' => $coupon->users->count(),
                    'is_expired' => $coupon->valid_until ? Carbon::parse($coupon->valid_until)->isPast() : false,
                    'remaining_quota' => $coupon->quota ? $coupon->quota - $coupon->users->count() : null,
                ];
            });

        return Inertia::render('Admin/ListKupon', [
            'coupons' => $coupons,
            'search' => $search,
            'success' => session('success')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:shop_coupons,code|max:50',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'valid_until' => 'nullable|date|after_or_equal:today',
            'quota' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Pastikan setidaknya salah satu dari discount_percent atau discount_amount diisi
        if (empty($request->discount_percent) && empty($request->discount_amount)) {
            return redirect()->back()->withErrors([
                'discount' => 'Either discount percent or discount amount must be provided.'
            ])->withInput();
        }

        Coupon::create([
            'code' => $request->code,
            'discount_percent' => $request->discount_percent,
            'discount_amount' => $request->discount_amount,
            'valid_until' => $request->valid_until,
            'quota' => $request->quota,
        ]);

        return redirect()->route('coupons.index')->with('success', 'Coupon created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Coupon $coupon)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:shop_coupons,code,' . $coupon->id,
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'valid_until' => 'nullable|date',
            'quota' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Pastikan setidaknya salah satu dari discount_percent atau discount_amount diisi
        if (empty($request->discount_percent) && empty($request->discount_amount)) {
            return redirect()->back()->withErrors([
                'discount' => 'Either discount percent or discount amount must be provided.'
            ])->withInput();
        }

        $coupon->update([
            'code' => $request->code,
            'discount_percent' => $request->discount_percent,
            'discount_amount' => $request->discount_amount,
            'valid_until' => $request->valid_until,
            'quota' => $request->quota,
        ]);

        return redirect()->route('coupons.index')->with('success', 'Coupon updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coupon $coupon)
    {
        // Periksa apakah kupon sudah digunakan
        $usageCount = CouponUsage::where('coupon_id', $coupon->id)->count();
        
        if ($usageCount > 0) {
            return response()->json([
                'message' => 'Cannot delete coupon that has been used by customers.'
            ], 422);
        }
        
        $coupon->delete();
        
        return redirect()->route('coupons.index')->with('success', 'Coupon deleted successfully.');
    }
    
    /**
     * View coupon usage details.
     */
    public function usageDetails(Coupon $coupon)
    {
        $usages = CouponUsage::where('coupon_id', $coupon->id)
            ->with('user')
            ->get()
            ->map(function ($usage) {
                return [
                    'id' => $usage->id,
                    'user_name' => $usage->user->name,
                    'user_email' => $usage->user->email,
                    'created_at' => Carbon::parse($usage->created_at)->format('Y-m-d H:i:s'),
                ];
            });
            
        return Inertia::render('Admin/KuponUsage', [
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'discount_percent' => $coupon->discount_percent,
                'discount_amount' => $coupon->discount_amount,
                'valid_until' => $coupon->valid_until ? Carbon::parse($coupon->valid_until)->format('Y-m-d') : null,
                'quota' => $coupon->quota,
            ],
            'usages' => $usages
        ]);
    }
}