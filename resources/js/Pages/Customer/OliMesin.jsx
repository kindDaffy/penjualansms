import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from '@inertiajs/inertia';
import { useState } from "react";
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { usePage } from '@inertiajs/react';
import { Checkbox } from "@/components/ui/checkbox"
import { FiShoppingCart } from "react-icons/fi";
import { Slider } from "@/components/ui/slider";
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
    const { products, search } = usePage().props;
    const [currentPage, setCurrentPage] = useState(products.current_page);
    const [loadingId, setLoadingId] = useState(null);

    const handlePageChange = (page) => {
        if (page > 0 && page <= products.last_page) {
            Inertia.get(route("oli-mesin"), { page }, {
                preserveScroll: true,
                preserveState: true,
            });
            setCurrentPage(page);
        }
    };
    
    function addToCart(productId) {
        router.post(route('cart.add'), { product_id: productId, qty: 1 }, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Produk Ditambahkan',
                    text: 'Produk berhasil masuk ke keranjang!',
                    timer: 1000,
                    showConfirmButton: false,
                });
                router.reload({ only: ['cart'] });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Produk gagal ditambahkan ke keranjang',
                });
            }
        })
    }

    function buy(productId){
        setLoadingId(productId);
        router.post(route('cart.buy'), { product_id: productId, qty: 1 }, {
            preserveScroll: true,
            nFinish: () => setLoadingId(null),
        })
    }
      
    return (
        <AuthenticatedLayout>
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
                                <p className="text-lg font-bold">Kategori</p>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Oli Motor</AccordionTrigger>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Motor 2 Tak
                                                <Checkbox />
                                            </AccordionContent>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Motor 4 Tak
                                                <Checkbox />
                                            </AccordionContent>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Motor Matic
                                                <Checkbox />
                                            </AccordionContent>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Motor Bebek
                                                <Checkbox />
                                            </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Oli Mobil</AccordionTrigger>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Mesin Bensin
                                                <Checkbox />
                                            </AccordionContent>
                                            <AccordionContent className="flex justify-between mx-3">
                                                Mesin Diesel
                                                <Checkbox />
                                            </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                        <div className="w-5/6 p-4 flex flex-col">
                            <div>
                                <h1 className="font-bold text-2xl">DAFTAR OLI MESIN</h1>
                            </div>

                            <div className="flex flex-row mt-4 space-x-2 items-center">
                                {/* <p className="font-medium">Filter</p> */}
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ascending">A-Z</SelectItem>
                                        <SelectItem value="descending">Z-A</SelectItem>
                                        <SelectItem value="price-asc">Harga Terendah</SelectItem>
                                        <SelectItem value="price-dsc">Harga Tertinggi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-5 mt-4">
                                {products.data.map(product => (
                                    <Card key={product.id}>
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
                                            <p className="text-lg font-bold mt-2">
                                                Rp {product.price.toLocaleString()}
                                            </p>

                                            <div className="mt-4 flex justify-end gap-2">
                                                <button onClick={() => addToCart(product.id)} className="flex items-center bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm">
                                                    <FiShoppingCart className="mr-2 text-base" />
                                                    Keranjang
                                                </button>
                                                <button
                                                    onClick={() => buy(product.id)}
                                                    disabled={loadingId === product.id}
                                                    className={`bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm flex items-center justify-center ${loadingId === product.id ? 'opacity-70' : ''}`}
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
                                ))}
                            </div>

                            <div className="flex mt-6 justify-center items-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            />
                                        </PaginationItem>

                                        {Array.from(
                                            { length: products.last_page },
                                            (_, i) => (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(i + 1)}
                                                        className={
                                                            currentPage === i + 1
                                                                ? "text-blue-600 font-bold"
                                                                : ""
                                                        }
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    )
}