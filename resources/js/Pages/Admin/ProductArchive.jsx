import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, router, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FaSearch, FaUndo, FaTrashAlt, FaBoxOpen } from "react-icons/fa"; // Import icons untuk restore dan force delete
import { useState, useEffect } from "react";

export default function ProductArchive() {
    const { products: initialProducts, success, search } = usePage().props; 
    
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState(search || "");
    const itemsPerPage = 10;

    const filteredProducts = initialProducts; 
    
    const offset = currentPage * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Fungsi untuk memicu restore produk
    const handleRestore = (product) => {
        Swal.fire({
            title: "Anda yakin ingin mengembalikan produk ini?",
            text: "Produk akan kembali muncul di daftar produk utama.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, kembalikan!",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route("products.restore", product.id), {}, {
                    onSuccess: () => Swal.fire("Dikembalikan!", "Produk berhasil dikembalikan.", "success"),
                    onError: (errors) => {
                        let errorMessage = "Gagal mengembalikan produk.";
                        if (errors && errors.message) {
                            errorMessage = errors.message;
                        } else if (typeof errors === 'string') {
                            errorMessage = errors;
                        }
                        Swal.fire("Error!", errorMessage, "error");
                    }
                });
            }
        });
    };

    // Fungsi untuk memicu penghapusan permanen produk
    const handleForceDelete = (product) => {
        Swal.fire({
            title: "PERINGATAN! Anda yakin ingin MENGHAPUS PERMANEN produk ini?",
            text: "Tindakan ini tidak dapat dibatalkan! Semua data terkait produk ini akan hilang selamanya.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus permanen!",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("products.forceDelete", product.id), {
                    onSuccess: () => Swal.fire("Dihapus Permanen!", "Produk telah berhasil dihapus permanen.", "success"),
                    onError: (errors) => {
                        let errorMessage = "Gagal menghapus produk permanen.";
                        if (errors && errors.message) {
                            errorMessage = errors.message;
                        } else if (typeof errors === 'string') {
                            errorMessage = errors;
                        }
                        Swal.fire("Error!", errorMessage, "error");
                    }
                });
            }
        });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route("products.archive"), { search: searchTerm }, { preserveState: true, preserveScroll: true }); 
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        if (success) {
            Swal.fire({ icon: "success", title: "Success", text: success, timer: 3000, showConfirmButton: false });
        }
    }, [success]);

    const formatRupiah = (amount) => {
        if (amount === null || amount === undefined || amount === 0) { 
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
        <AdminLayout header={<h1>Product Archive</h1>}>
            <Head title="Product Archive - Admin" />
            <div className="max-w-screen-xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <Link
                        href={route("products.index")} // Tombol kembali ke daftar produk aktif
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                    >
                        <FaBoxOpen className="mr-2" /> {/* Anda mungkin perlu mengimport FaBoxOpen */}
                        Active Products
                    </Link>
                    
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search archived products..."
                            className="border px-4 py-2 rounded-md w-64 pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Archived Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Archived At</th> {/* Kolom baru */}
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts && paginatedProducts.length > 0 ? (
                                    paginatedProducts.map((product, index) => (
                                        <tr key={product.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">
                                                <img
                                                    src={product.featured_image || 'https://placehold.jp/150x150.png'}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-md shadow"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{product.sku}</td>
                                            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {formatRupiah(product.price)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{product.status}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {product.stock_qty === null || product.stock_qty === 0 ? 'Not Set' : product.stock_qty}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {product.deleted_at}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="flex space-x-1 items-center">
                                                    <button
                                                        onClick={() => handleRestore(product)}
                                                        className="flex items-center bg-blue-500 text-white px-4 py-4 text-xs rounded-md shadow hover:bg-blue-600"
                                                    >
                                                        <FaUndo className="mr-1" /> Restore
                                                    </button>
                                                    <button
                                                        onClick={() => handleForceDelete(product)}
                                                        className="flex items-center bg-red-500 text-white px-2 py-2 text-xs rounded-md shadow hover:bg-red-800"
                                                    >
                                                        <FaTrashAlt className="mr-1" /> Delete Permanently
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4"> {/* colSpan disesuaikan */}
                                            No archived products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="mt-6">
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
        </AdminLayout>
    );
}