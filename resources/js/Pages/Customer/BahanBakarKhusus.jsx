import DynamicLayout from '@/Layouts/DynamicLayout';
import { Head } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';
import { useState } from "react";
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { FiShoppingCart } from "react-icons/fi";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function OliMesin() {
    const { products, search, auth } = usePage().props;
    const [loadingId, setLoadingId] = useState(null);
    const selectedCategory = usePage().props.selectedCategory;

    const reloadCart = () => {
        router.reload({ only: ['cart'], preserveScroll: true });
    };

    const handleSortChange = (value) => {
        router.get(route('bbk'), {
            sort: value === 'default' ? null : value,
            category: selectedCategory,
            search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    function addToCart(productId) {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        Swal.fire({
            title: 'Gunakan jerigen dari SPBU?',
            text: 'Biaya tambahan Rp20.000 akan dikenakan jika menggunakan jerigen dari SPBU.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, pakai jerigen',
            cancelButtonText: 'Tidak, bawa sendiri',
        }).then((result) => {
            const useJerigen = result.isConfirmed;

            router.post(route('cart.add'), {
                product_id: productId,
                qty: 5,
                use_jerigen: useJerigen
            }, {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Produk Ditambahkan',
                        text: useJerigen
                            ? 'Produk + jerigen berhasil masuk ke keranjang!'
                            : 'Produk berhasil masuk ke keranjang!',
                        timer: 1000,
                        showConfirmButton: false,
                    }).then(() => {
                        reloadCart();
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Produk gagal ditambahkan ke keranjang',
                    });
                }
            });
        });
    }
    
    function buy(productId){
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        Swal.fire({
            title: 'Gunakan jerigen dari SPBU?',
            text: 'Biaya tambahan Rp20.000 akan dikenakan jika menggunakan jerigen dari SPBU.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, pakai jerigen',
            cancelButtonText: 'Tidak, bawa sendiri',
        }).then((result) => {
            const useJerigen = result.isConfirmed;

            setLoadingId(productId);
            router.post(route('cart.buy'), {
                product_id: productId,
                qty: 5,
                use_jerigen: useJerigen
            }, {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Produk Ditambahkan',
                        text: useJerigen
                            ? 'Produk + jerigen berhasil masuk ke keranjang!'
                            : 'Produk berhasil masuk ke keranjang!',
                        timer: 1000,
                        showConfirmButton: false,
                    }).then(() => {
                        reloadCart();
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Produk gagal ditambahkan ke keranjang',
                    });
                }
            });
        });
    }

    return (
        <DynamicLayout>
            <Head title="Bahan Bakar Khusus" />

            <div className="py-12">
                <div className="max-w-7xl pb-8 mb-4 mx-auto sm:px-6 lg:px-8 bg-white rounded-xl">
                    <div className="w-full px-4 pt-8 pb-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator /> 
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Bahan Bakar Khusus</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex">
                        <div className="w-full p-4 flex flex-col">
                            <div>
                                <h1 className="font-bold text-2xl">DAFTAR BAHAN BAKAR KHUSUS</h1>
                            </div>

                            <div className="flex flex-row mt-4 space-x-2 items-center">
                                {/* <p className="font-medium">Filter</p> */}
                                <Select onValueChange={handleSortChange} defaultValue="default">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default</SelectItem>
                                        <SelectItem value="ascending">A-Z</SelectItem>
                                        <SelectItem value="descending">Z-A</SelectItem>
                                        <SelectItem value="price-asc">Harga Terendah</SelectItem>
                                        <SelectItem value="price-dsc">Harga Tertinggi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <p className="mt-3 text-sm text-blue-500 italic">Note: Pembelian Bahan Bakar Khusus minimal 5 liter</p>

                            <div className="grid grid-cols-2 gap-5 mt-4">
                                {products.data.map(product => {
                                    const isOutOfStock = product.stock_qty < product.low_stock_threshold;
                                    const isLowStock = product.stock_qty >= 5 && product.stock_qty <= 10;

                                    return (
                                        <Card 
                                            key={product.id} 
                                            className={isOutOfStock ? 'opacity-50 bg-gray-100 cursor-not-allowed' : ''}
                                        >
                                            <CardHeader>
                                                <img
                                                    src={product.featured_image}
                                                    alt={product.name}
                                                    className="w-full h-auto object-cover rounded-md border"
                                                />
                                            </CardHeader>
                                            <CardContent>
                                                <CardTitle className="text-lg font-semibold">
                                                    {product.name}
                                                </CardTitle>
                                                <CardDescription className="text-gray-600">
                                                    {product.body || "Deskripsi tidak tersedia"}
                                                </CardDescription>

                                                {isOutOfStock ? (
                                                    <p className="text-red-600 font-semibold mt-2">Stok Habis</p>
                                                ) : isLowStock ? (
                                                    <p className="text-orange-500 font-medium mt-2">Stok hampir habis</p>
                                                ) : null}

                                                <p className="text-lg font-bold mt-2">
                                                    Rp {product.price.toLocaleString()}
                                                </p>

                                                <div className="mt-4 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => addToCart(product.id)}
                                                        disabled={isOutOfStock}
                                                        className={`flex items-center px-3 py-2 rounded text-sm ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                                    >
                                                        <FiShoppingCart className="mr-2 text-base" />
                                                        Keranjang
                                                    </button>
                                                    <button
                                                        onClick={() => buy(product.id)}
                                                        disabled={loadingId === product.id || isOutOfStock}
                                                        className={`px-3 py-2 rounded text-sm flex items-center justify-center ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} ${loadingId === product.id ? 'opacity-70' : ''}`}
                                                    >
                                                        {loadingId === product.id ? (
                                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
                                                            </svg>
                                                        ) : (
                                                            'Beli'
                                                        )}
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DynamicLayout>
    )
}