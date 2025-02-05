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
    const { categories, filters, success } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [currentPage, setCurrentPage] = useState(0);


    const openAddModal = () => {
        reset();
        setEditMode(false);
        setShowModal(true);
    };
    
    const openEditModal = (category) => {
        setEditMode(true);
        setCurrentCategory(category);
        setData({ name: category.name });
        setShowModal(true);
    };
    
    // State untuk modal
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    // Pagination configuration
    const itemsPerPage = 5;
    const offset = currentPage * itemsPerPage;
    const paginatedCategories = Array.isArray(categories) ? categories.slice(offset, offset + itemsPerPage) : [];
    const pageCount = Array.isArray(categories) ? Math.ceil(categories.length / itemsPerPage) : 0;
    
    // Form handling
    const { data, setData, post, put, errors, reset } = useForm({
        name: "",
        parent_id: "",
    });

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route("categories.index", { search });
    };

    // Handle page change for pagination
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Menampilkan pesan sukses dengan SweetAlert
    

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (editMode) {
            put(route("categories.update", currentCategory.id), {
                onSuccess: () => {
                    setShowModal(false);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Category updated successfully!",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                },
            });
        } else {
            post(route("categories.store"), {
                onSuccess: () => {
                    setShowModal(false);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Category added successfully!",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                },
            });
        }
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
            setShowSuccessAlert(false); // Hentikan pemanggilan ulang setelah sukses ditampilkan
        }
    }, [success, showSuccessAlert]);


    console.log(categories);

    return (
        <AdminLayout header={<h1>Categories</h1>}>
            <Head title="Categories - Admin" />

            <div className="max-w-screen-xl mx-auto p-6">
             <div className="flex justify-between items-center mb-4">
                    {/* Add Button */}
                    <button
                        onClick={openAddModal}
                        className="w-20 h-6 flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 mb-4"
                    >
                        <FaPlus className="mr-2" />
                        Add
                    </button>
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex space-x-2 items-center">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories..."
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
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Category Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCategories.length > 0 ? (
                                    paginatedCategories.map((category, index) => (
                                        <tr key={category.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">
                                                {offset + index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(category)}
                                                        className="h-6 flex items-center bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <Link
                                                        href={route("categories.destroy", category.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="h-6 flex items-center bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                                                        onClick={(e) => {
                                                            if (!confirm("Are you sure you want to delete this category?")) {
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
                                        <td colSpan="3" className="text-center py-4">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="mt-6 ">
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
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md w-96 transition-all duration-200 transform">
                        <h2 className="text-lg font-bold mb-4">{editMode ? "Edit Category" : "Add Category"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
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
