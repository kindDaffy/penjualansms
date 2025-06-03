import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, router } from "@inertiajs/react";
import ReactPaginate from "react-paginate";
import { FaSearch, FaEye } from "react-icons/fa"; // Pastikan FaEye diimport
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from 'sweetalert2';

// Komponen Modal terpisah untuk Order Details
const OrderDetailModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order || !order.items) {
        return null; // Jangan render jika modal tidak terbuka atau data order tidak ada
    }

    // Helper untuk format Rupiah di dalam modal
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) {
            return 'Not Set';
        }
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-w-md transition-all duration-200 transform">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Order Details #{order.no}</h2>
                <div className="mb-4 text-gray-700">
                    <p><strong>Customer:</strong> {order.full_name}</p>
                    <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Order Date:</strong> {order.order_date}</p>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-gray-800">Products:</h3>
                {order.items.length > 0 ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md bg-gray-50">
                        {order.items.map(item => (
                            <li key={item.id} className="flex justify-between items-center text-gray-700 border-b pb-1 last:border-b-0 last:pb-0">
                                <span>{item.product_name}</span>
                                <span className="font-medium">Qty: {item.qty}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No products found for this order.</p>
                )}

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ListTransaction() {
    const { orders, search, status } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(search || "");
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(status || "ALL");
    
    // State untuk modal detail order
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const itemsPerPage = 5;
    const offset = currentPage * itemsPerPage;
    const paginatedOrders = Array.isArray(orders) ? orders.slice(offset, offset + itemsPerPage) : [];
    const pageCount = Math.ceil(orders.length / itemsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleComplete = (orderId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to complete this transaction?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, complete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('transaction.complete', orderId), {}, {
                    onSuccess: () => {
                        Swal.fire(
                            'Completed!',
                            'Transaction status has been updated to COMPLETED.',
                            'success'
                        );
                        router.reload({ preserveState: true });
                    },
                    onError: (errors) => {
                        Swal.fire(
                            'Error!',
                            'Failed to update transaction status.',
                            'error'
                        );
                    }
                });
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route("transaction.index"), { search: searchTerm, status: selectedStatus }, { preserveState: true, preserveScroll: true });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedStatus]);

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        router.get(route("transaction.index"), { search: searchTerm, status }, { preserveState: true });
    };

    const formatRupiah = (amount) => {
        if (amount === null || amount === undefined) {
            return 'Not Set';
        }
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Fungsi untuk membuka modal detail order
    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    // Fungsi untuk menutup modal detail order
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    };

    return (
        <AdminLayout header={<h1>Transactions</h1>}>
            <Head title="Transactions - Admin" />
            <div className="max-w-screen-xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleStatusChange("ALL")}
                            className={`px-4 py-2 rounded-md ${selectedStatus === "ALL" ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
                        >
                            ALL
                        </button>
                        <button
                            onClick={() => handleStatusChange("PENDING")}
                            className={`px-4 py-2 rounded-md ${selectedStatus === "PENDING" ? "bg-orange-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
                        >
                            PENDING
                        </button>
                        <button
                            onClick={() => handleStatusChange("CONFIRMED")}
                            className={`px-4 py-2 rounded-md ${selectedStatus === "CONFIRMED" ? "bg-green-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
                        >
                            CONFIRMED
                        </button>
                        <button
                            onClick={() => handleStatusChange("COMPLETED")}
                            className={`px-4 py-2 rounded-md ${selectedStatus === "COMPLETED" ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
                        >
                            COMPLETED
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="border px-4 py-2 rounded-md w-64 pl-10"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Order Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Details</th> {/* Kolom baru untuk tombol mata */}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.length > 0 ? (
                                    paginatedOrders.map((order) => (
                                        <tr key={order.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">{order.no}</td>
                                            <td className="border border-gray-300 px-4 py-2">{order.full_name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{formatRupiah(order.total)}</td>
                                            <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                                            <td className="border border-gray-300 px-4 py-2">{order.order_date}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {order.status === "CONFIRMED" && (
                                                    <button
                                                        onClick={() => handleComplete(order.id)}
                                                        className="text-white hover:bg-green-600 px-4 py-2 rounded-md bg-green-500"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <button
                                                    onClick={() => openDetailModal(order)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded-md shadow hover:bg-blue-600" // Warna biru untuk ikon mata
                                                >
                                                    <FaEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4"> {/* colSpan disesuaikan */}
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                    </CardContent>
                </Card>
            </div>

            {/* Render Modal Detail Order */}
            <OrderDetailModal isOpen={showDetailModal} onClose={closeDetailModal} order={selectedOrder} />
        </AdminLayout>
    );
}