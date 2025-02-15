import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function EditProduct() {
    const { product, categories } = usePage().props;

    const { data, setData, put, errors } = useForm({
        name: product.name,
        sku: product.sku,
        category_id: product.category_id,
        price: product.price,
        sale_price: product.sale_price,
        stock_status: product.stock_status,
        status: product.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("products.update", product.id), {
            onSuccess: () => Swal.fire("Success", "Product updated successfully!", "success"),
        });
    };

    return (
        <AdminLayout header={<h1>Edit Product</h1>}>
            <Head title="Edit Product - Admin" />
            <div className="max-w-screen-md mx-auto p-6 bg-white shadow-md rounded-md">
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
                        <a
                            href={route("products.index")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                        >
                            Cancel
                        </a>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
