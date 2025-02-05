import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, Link, useForm } from "@inertiajs/react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Index() {
    const { users, filters, success } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [currentPage, setCurrentPage] = useState(0);

    // Pagination configuration
    const itemsPerPage = 5;
    const offset = currentPage * itemsPerPage;
    const paginatedUsers = Array.isArray(users) ? users.slice(offset, offset + itemsPerPage) : [];
    const pageCount = Array.isArray(users) ? Math.ceil(users.length / itemsPerPage) : 0;

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route("users.index", { search });
    };

    // Handle page change for pagination
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };


    // Show success alert on page load if applicable
    useEffect(() => {
        if (success) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: success,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    }, [success]);

    return (
        <AdminLayout header={<h1>Users</h1>}>
            <Head title="Users - Admin" />

            <div className="max-w-screen-xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex space-x-2 items-center">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="border px-4 py-2 rounded-md w-72"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Table */}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user, index) => (
                                        <tr key={user.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">
                                                {offset + index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route("users.destroy", user.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="h-6 flex items-center bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                                                        onClick={(e) => {
                                                            if (!confirm("Are you sure you want to delete this user?")) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <ReactPaginate
                            previousLabel={"← Previous"}
                            nextLabel={"Next →"}
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
