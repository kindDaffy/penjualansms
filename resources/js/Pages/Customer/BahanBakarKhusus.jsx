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
            name: 'Pertamax',
            price: 12900,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/Pertamax.png',
        },
        {
            id: 2,
            name: 'Pertamax Turbo',
            price: 14000,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/Pertamax Turbo.png',
        },
        {
            id: 3,
            name: 'Dexlite',
            price: 14600,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/Dexlite.png',
        },
        {
            id: 4,
            name: 'Pertamina Dex',
            price: 14800,
            description: 'Oli berkualitas untuk performa terbaik.',
            image: '/images/Pertamina Dex.png',
        },
    ];

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
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

                            <div className="grid grid-cols-2 gap-5 mt-4">
                                {filteredProducts.map((product) => (
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
                                            <p className="text-lg font-bold mt-2">Rp {product.price.toLocaleString()}/Liter</p>
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
                        </div>
                    </div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    )
}