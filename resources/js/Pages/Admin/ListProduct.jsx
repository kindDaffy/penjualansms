import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Products() {
    const { categories, products, success } = usePage().props;

    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Form handling
    const { data, setData, post, put, delete: destroy, errors, reset } = useForm({
        name: "",
        sku: "",
        category_id: "",
        price: "",
        sale_price: "",
        stock_status: "IN_STOCK",
        status: "ACTIVE",
    });

    // Menampilkan pesan sukses dengan SweetAlert
    useEffect(() => {
        if (success) {
            Swal.fire({ icon: "success", title: "Success", text: success, timer: 3000, showConfirmButton: false });
        }
    }, [success]);

    const openAddModal = () => {
        reset();
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditMode(true);
        setCurrentProduct(product);
        setData({
            name: product.name,
            sku: product.sku,
            category_id: product.category_id,
            price: product.price,
            sale_price: product.sale_price,
            stock_status: product.stock_status,
            status: product.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editMode
            ? put(route("products.update", currentProduct.id), { onSuccess: () => setIsModalOpen(false) })
            : post(route("products.store"), { onSuccess: () => setIsModalOpen(false) });
    };

    const handleDelete = (product) => {
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
                destroy(route("products.destroy", product.id), {
                    onSuccess: () => Swal.fire("Deleted!", "Product has been deleted.", "success"),
                });
            }
        });
    };

    const openEditPage = (product) => {
        router.get(route("products.edit", product.id)); // Redirect ke halaman edit
    };

    return (
        <AdminLayout header={<h1>Products</h1>}>
            <Head title="Products - Admin" />
            <div className="max-w-screen-xl mx-auto p-6">
                <div className="mb-4">
                    <button
                        onClick={openAddModal}
                        className="w-20 h-6 flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" />
                        Add
                    </button>
                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products && products.length > 0 ? (
                                    products.map((product, index) => (
                                        <tr key={product.id}>
                                            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{product.category?.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openEditPage(product)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md w-96 transition-all duration-200 transform">
                        <h2 className="text-lg font-bold mb-4">{editMode ? "Edit Product" : "Add Product"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData("category_id", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="text-red-500 text-sm">{errors.category_id}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
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
