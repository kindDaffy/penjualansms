import DynamicLayout from '@/Layouts/DynamicLayout';
import { Head } from "@inertiajs/react";
import { Inertia } from '@inertiajs/inertia';
import { useState, useEffect } from "react";
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { usePage } from '@inertiajs/react';
import { Checkbox } from "@/components/ui/checkbox"
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
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
    CardHeader,
    CardFooter,
    CardTitle,
} from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function OliMesin() {
    const { products, search, auth } = usePage().props;
    const [currentPage, setCurrentPage] = useState(products.current_page || 1);
    const [loadingId, setLoadingId] = useState(null);
    const selectedCategory = usePage().props.selectedCategory;
    const [searchText, setSearchText] = useState(search || '');

    const reloadCart = () => {
        router.reload({ only: ['cart'], preserveScroll: true });
    };

    useEffect(() => {
        setCurrentPage(products.current_page || 1);
    }, [products.current_page]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= products.last_page && page !== currentPage) {
            // Cara 1: Menggunakan router.visit (lebih eksplisit)
            router.visit(route("oli-mesin"), {
                method: 'get',
                data: {
                    page: page,
                    search: search || '',
                    category: selectedCategory || '',
                    per_page: products.per_page || 9
                },
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const handleCategoryFilter = (slug) => {
        const nextCategory = selectedCategory === slug ? null : slug;

        router.get(route('oli-mesin'), 
            nextCategory ? { category: nextCategory } : {}, 
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const handleSortChange = (value) => {
        router.get(route('oli-mesin'), {
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

        router.post(route('cart.add'), { product_id: productId, qty: 1 }, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Produk Ditambahkan',
                    text: 'Produk berhasil masuk ke keranjang!',
                    timer: 1000,
                    showConfirmButton: false,
                }).then(() => {
                    reloadCart();
                })
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Produk gagal ditambahkan ke keranjang',
                }).then(() => {
                    reloadCart();
                })
            }
        })
    }

    function buy(productId){
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        setLoadingId(productId);
        router.post(route('cart.buy'), { product_id: productId, qty: 1 }, {
            preserveScroll: true,
            nFinish: () => setLoadingId(null),
        })
    }

    useEffect(() => {
        if (searchText === '') {
            router.get(route('oli-mesin'), {
                category: selectedCategory,
                per_page: 9,
            }, {
                preserveState: true,
                replace: true,
            });
        }
    }, [searchText]);

      
    return (
        <DynamicLayout>
            <Head title="Oli Mesin" />

            <div className="py-12">
                <div className="max-w-7xl mb-4 mx-auto sm:px-6 lg:px-8 bg-white rounded-xl">
                    <div className="w-full px-4 pt-8 pb-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator /> 
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Oli Mesin</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex">
                        <div className="w-1/6 flex-col p-4">
                            <div>
                                <p className="text-lg font-semibold">Kategori</p>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Oli Motor</AccordionTrigger>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Motor 2 Tak
                                                <Checkbox
                                                    checked={selectedCategory === 'oli-motor-2-tak'}
                                                    onCheckedChange={() => handleCategoryFilter('oli-motor-2-tak')}
                                                />
                                            </AccordionContent>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Motor 4 Tak
                                                <Checkbox 
                                                    checked={selectedCategory === 'oli-motor-sport'}
                                                    onCheckedChange={() => handleCategoryFilter('oli-motor-sport')}
                                                />
                                            </AccordionContent>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Motor Matic
                                                <Checkbox 
                                                    checked={selectedCategory === 'oli-motor-matic'}
                                                    onCheckedChange={() => handleCategoryFilter('oli-motor-matic')}
                                                />
                                            </AccordionContent>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Motor Bebek
                                                <Checkbox
                                                    checked={selectedCategory === 'oli-motor-bebek'}
                                                    onCheckedChange={() => handleCategoryFilter('oli-motor-bebek')}
                                                />
                                            </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Oli Mobil</AccordionTrigger>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Mesin Bensin
                                                <Checkbox
                                                    checked={selectedCategory === 'oli-mobil-bensin'}
                                                    onCheckedChange={() => handleCategoryFilter('oli-mobil-bensin')}
                                                />
                                            </AccordionContent>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Mesin Diesel
                                                <Checkbox
                                                    checked={selectedCategory === 'oli-mobil-diesel'}
                                                    onCheckedChange={() => handleCategoryFilter('oli-mobil-diesel')}
                                                />
                                            </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                        <div className="w-5/6 p-4 flex flex-col">
                            <div>
                                <h1 className="font-semibold text-2xl">DAFTAR OLI MESIN</h1>
                            </div>

                            <div className="flex flex-row mt-4 space-x-2 items-center">
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

                            <div className="mt-4 w-full flex">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        router.get(route('oli-mesin'), {
                                            search: searchText,
                                            category: selectedCategory,
                                            per_page: 9,
                                        });
                                    }}
                                    className="flex space-x-2 w-2/3"
                                >
                                    <input
                                        type="text"
                                        placeholder="Cari produk oli..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="border border-gray-300 px-3 py-2 rounded-md w-full"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Cari
                                    </button>
                                </form>
                            </div>

                            {selectedCategory && (
                                <div className="mt-3 text-sm text-blue-600 mb-2">
                                    Menampilkan produk : <strong>{selectedCategory.replace(/-/g, ' ')}</strong>
                                </div>
                            )}

                            <div className="grid sm:grid-cols-3 gap-5 mt-4">
                                {products.data.map(product => {
                                    const isOutOfStock = product.stock_qty <= 0;
                                    const isLowStock = product.stock_qty <= product.low_stock_threshold && product.stock_qty > 0;

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

                                                <p className="text-lg font-semibold mt-2">
                                                    Rp {product.price.toLocaleString()}
                                                </p>

                                                {isOutOfStock ? (
                                                    <p className="text-red-600 font-semibold mt-2">Stok Habis</p>
                                                ) : isLowStock ? (
                                                    <p className="text-orange-500 font-medium mt-2">Stok hampir habis</p>
                                                ) : null}

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

                            <div className="flex mt-6 justify-center items-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage <= 1} // disable jika halaman pertama
                                                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {Array.from(
                                            { length: products.last_page },
                                            (_, i) => (
                                                <PaginationItem key={i + 1}>
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(i + 1)}
                                                        className={`cursor-pointer ${
                                                            currentPage === i + 1
                                                                ? "text-blue-600 font-bold bg-blue-50"
                                                                : "hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage >= products.last_page} // disable jika halaman terakhir
                                                className={currentPage >= products.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </DynamicLayout>
    )
}