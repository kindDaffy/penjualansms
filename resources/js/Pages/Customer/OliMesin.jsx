import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
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
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function OliMesin() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;  // Jumlah item per halaman

    const products = [
        {
            id: 1,
            name: 'Oli Mesin X',
            price: 50000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 2,
            name: 'Oli Mesin Y',
            price: 70000,
            description: 'Oli berkualitas untuOli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 3,
            name: 'Oli Mesin X',
            price: 50000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 4,
            name: 'Oli Mesin Y',
            price: 70000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 5,
            name: 'Oli Mesin X',
            price: 50000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 6,
            name: 'Oli Mesin Y',
            price: 70000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 7,
            name: 'Oli Mesin X',
            price: 50000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 8,
            name: 'Oli Mesin Y',
            price: 70000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 9,
            name: 'Oli Mesin X',
            price: 50000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        {
            id: 10,
            name: 'Oli Mesin Y',
            price: 70000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/2T-Enviro.png',
        },
        // Add more products as needed
    ];

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    // Hitung total halaman
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Ambil produk untuk halaman saat ini
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
                                
                                <div>
                                    <p className="text-lg font-bold mt-4">Range Harga</p>
                                    <Slider defaultValue={[10]} max={100} step={1} className="mt-2"/>
                                </div>
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
                                {currentProducts.map((product) => (
                                    <Card key={product.id}>
                                        <CardHeader>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-auto object-cover rounded-md border" 
                                            />
                                        </CardHeader>
                                        <CardContent>
                                            <CardTitle   className="text-lg font-semibold">{product.name}</CardTitle  >
                                            <CardDescription className="text-gray-600">{product.description}</CardDescription>
                                            <p className="text-lg font-bold mt-2">Rp {product.price.toLocaleString()}</p>
                                            <div className='flex justify-end mt-6 space-x-3'>
                                                <button
                                                    className=" bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                                                >
                                                    Beli
                                                </button>
                                                <button
                                                    className=" bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                                                >
                                                    Tambahkan ke Keranjang
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
                                            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(i + 1)}
                                                    className={currentPage === i + 1 ? "text-blue-600 font-bold" : ""}
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
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