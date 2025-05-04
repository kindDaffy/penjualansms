<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Ambil parameter search dari request
        $search = $request->input('search', '');

        // Query untuk mendapatkan data users dengan filter search
        $users = User::where('name', 'like', "%$search%")
            ->orWhere('email', 'like', "%$search%")
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/ListUsers', [
            'users' => $users,
            'filters' => $request->only('search'),
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {

    }

    public function updateRole(Request $request, User $user)
    {
        // Validasi input role
        $request->validate([
            'role' => 'required|in:admin,customer', // Pastikan hanya role admin dan customer yang valid
        ]);
    
        // Update role pengguna
        $user->role = $request->role;
        $user->save();
    
        // Mengirimkan respons sukses
        return response()->json(['message' => 'Role updated successfully']);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
