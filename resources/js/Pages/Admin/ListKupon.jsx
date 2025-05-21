import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, Link, useForm, router } from "@inertiajs/react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { FaPlus, FaSearch, FaEye } from "react-icons/fa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Index() {
    const { coupons, search, success } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(search || "");
    const [currentPage, setCurrentPage] = useState(0);

    // State untuk modal
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState(null);

    // Pagination configuration
    const itemsPerPage = 5;
    const offset = currentPage * itemsPerPage;
    const paginatedCoupons = Array.isArray(coupons) ? coupons.slice(offset, offset + itemsPerPage) : [];
    const pageCount = Array.isArray(coupons) ? Math.ceil(coupons.length / itemsPerPage) : 0;
    
    // Form handling
    const { data, setData, post, put, errors, reset } = useForm({
        code: "",
        discount_percent: "",
        discount_amount: "",
        valid_until: "",
        quota: "",
    });

    const openAddModal = () => {
        reset();
        setEditMode(false);
        setShowModal(true);
    };
    
    const openEditModal = (coupon) => {
        setEditMode(true);
        setCurrentCoupon(coupon);
        setData({
            code: coupon.code,
            discount_percent: coupon.discount_percent || "",
            discount_amount: coupon.discount_amount || "",
            valid_until: coupon.valid_until || "",
            quota: coupon.quota || "",
        });
        setShowModal(true);
    };

    // Handle page change for pagination
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (editMode) {
            put(route("coupons.update", currentCoupon.id), {
                onSuccess: () => {
                    setShowModal(false);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Coupon updated successfully!",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                },
            });
        } else {
            post(route("coupons.store"), {
                onSuccess: () => {
                    setShowModal(false);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Coupon added successfully!",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                },
            });
        }
    };

    const handleDelete = (coupon) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("coupons.destroy", coupon.id), {
                    onSuccess: () => {
                        Swal.fire("Deleted!", "Coupon has been deleted.", "success");
                    },
                    onError: (errors) => {
                        Swal.fire("Error!", errors.message || "Failed to delete coupon.", "error");
                    }
                });
            }
        });
    };
    
    const [showSuccessAlert, setShowSuccessAlert] = useState(true);

    useEffect(() => {
        if (success && showSuccessAlert) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: success,
                timer: 3000,
                showConfirmButton: false,
            });
            setShowSuccessAlert(false);
        }
    }, [success, showSuccessAlert]);

    // Handle perubahan input pencarian
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route("coupons.index"), { search: searchTerm }, { preserveState: true });
        }, 500); // Delay 500ms untuk debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <AdminLayout header={<h1>Coupons</h1>}>
            <Head title="Coupons - Admin" />
            <div className="max-w-screen-xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Add Button */}
                    <button
                        onClick={openAddModal}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" />
                        Add Coupon
                    </button>
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            className="border px-4 py-2 rounded-md w-64 pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
                {/* Table */}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Coupons</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Discount</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Valid Until</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Quota</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Usage</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCoupons.length > 0 ? (
                                    paginatedCoupons.map((coupon, index) => (
                                        <tr key={coupon.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">
                                                {offset + index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 font-medium">
                                                {coupon.code}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {coupon.discount_percent ? `${coupon.discount_percent}%` : ''}
                                                {coupon.discount_percent && coupon.discount_amount ? ' / ' : ''}
                                                {coupon.discount_amount ? `Rp ${coupon.discount_amount.toLocaleString()}` : ''}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {coupon.valid_until || 'No Expiry'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {coupon.quota ? `${coupon.remaining_quota} / ${coupon.quota}` : 'Unlimited'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {coupon.usage_count} uses
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {coupon.is_expired ? (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Expired</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route("coupons.usage-details", coupon.id)}
                                                        className="bg-blue-500 text-white px-2 py-1 rounded-md shadow hover:bg-blue-600"
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                    <button
                                                        onClick={() => openEditModal(coupon)}
                                                        className="bg-green-500 text-white px-2 py-1 rounded-md shadow hover:bg-green-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coupon)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded-md shadow hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            No coupons found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="mt-6">
                            {/* Pagination */}
                            <ReactPaginate
                                previousLabel={"← Sebelumnya"}
                                nextLabel={"Selanjutnya →"}
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                                containerClassName={"flex justify-center mt-4 space-x-2"}
                                pageClassName={"px-3 py-1 border rounded-md"}
                                previousClassName={"px-4 py-2"}
                                nextClassName={"px-4 py-2"}
                                activeClassName={"bg-blue-500 text-white font-bold"}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96 transition-all duration-200 transform">
                        <h2 className="text-lg font-bold mb-4">{editMode ? "Edit Coupon" : "Add Coupon"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData("code", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="e.g. SUMMER2023"
                                />
                                {errors.code && <div className="text-red-500 text-sm mt-1">{errors.code}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Discount Percent (%)</label>
                                <input
                                    type="number"
                                    value={data.discount_percent}
                                    onChange={(e) => setData("discount_percent", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="e.g. 10"
                                    min="0"
                                    max="100"
                                />
                                {errors.discount_percent && <div className="text-red-500 text-sm mt-1">{errors.discount_percent}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Discount Amount (Rp)</label>
                                <input
                                    type="number"
                                    value={data.discount_amount}
                                    onChange={(e) => setData("discount_amount", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="e.g. 50000"
                                    min="0"
                                />
                                {errors.discount_amount && <div className="text-red-500 text-sm mt-1">{errors.discount_amount}</div>}
                                {errors.discount && <div className="text-red-500 text-sm mt-1">{errors.discount}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                                <input
                                    type="date"
                                    value={data.valid_until}
                                    onChange={(e) => setData("valid_until", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                {errors.valid_until && <div className="text-red-500 text-sm mt-1">{errors.valid_until}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Quota (Leave empty for unlimited)</label>
                                <input
                                    type="number"
                                    value={data.quota}
                                    onChange={(e) => setData("quota", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="e.g. 100"
                                    min="1"
                                />
                                {errors.quota && <div className="text-red-500 text-sm mt-1">{errors.quota}</div>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                    {editMode ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}