import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import ReactPaginate from "react-paginate";
import { FaSearch } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Transactions() {
    const { orders, search, status } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(search || "");
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(status || "PENDING");

    // Pagination configuration
    const itemsPerPage = 5;
    const offset = currentPage * itemsPerPage;
    const paginatedOrders = Array.isArray(orders) ? orders.slice(offset, offset + itemsPerPage) : [];
    const pageCount = Math.ceil(orders.length / itemsPerPage);

    // Handle page change for pagination
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
            // Kirim permintaan ke backend untuk memperbarui status
            router.post(route('transaction.complete', orderId), {}, {
                onSuccess: () => {
                    Swal.fire(
                        'Completed!',
                        'Transaction status has been updated to COMPLETED.',
                        'success'
                    );
                },
                onError: () => {
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

    // Handle search term change with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route("transactions.index"), { search: searchTerm, status: selectedStatus }, { preserveState: true });
        }, 500); // Delay 500ms for debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedStatus]);

    // Handle status filter change
    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        router.get(route("transaction.index"), { search: searchTerm, status }, { preserveState: true });
    };

    return (
        <AdminLayout header={<h1>Transactions</h1>}>
            <Head title="Transactions - Admin" />
            <div className="max-w-screen-xl mx-auto p-6">
                {/* Search and Filter */}
                <div className="flex justify-between items-center mb-4">
                    {/* Status Filter */}
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

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="border px-4 py-2 rounded-md w-64 pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Transactions Table */}
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
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.length > 0 ? (
                                    paginatedOrders.map((order, index) => (
                                        order.items.map((item, itemIndex) => (
                                            <tr key={itemIndex} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                                <td className="border border-gray-300 px-4 py-2">{order.customer_first_name} {order.customer_last_name}</td>
                                                <td className="border border-gray-300 px-4 py-2">{item.sub_total}</td>
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

                                            </tr>
                                        ))
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                    </CardContent>
                </Card>

            </div>
        </AdminLayout>
    );
}
