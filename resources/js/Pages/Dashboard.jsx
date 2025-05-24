import DynamicLayout from '@/Layouts/DynamicLayout'; 
import { Head, Link } from '@inertiajs/react';
import * as React from "react";
import { useState, useEffect } from 'react';
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
    const autoplayPlugin = React.useMemo(() => Autoplay({ delay: 3000, stopOnInteraction: false }), []);

    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const hasShownSplash = sessionStorage.getItem('hasShownSplash');

        if (!hasShownSplash) {
            setShowSplash(true);
            sessionStorage.setItem('hasShownSplash', 'true');

            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            setShowSplash(false);
        }
    }, []);


    return (
        <>
            {showSplash ? (
                <div className="flex items-center justify-center min-h-screen bg-white">
                    <img
                        src="/images/logoSMS2.png"
                        alt="Splash Logo"
                        className="w-48 h-48 animate-pulse"
                    />
                </div>
            ) : (
                <DynamicLayout>
                    <Head title="Home" />

                    <div className="py-8 sm:py-12">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {/* Carousel Section */}
                            <Carousel
                                plugins={[autoplayPlugin]}
                                className="w-full max-w-7xl mx-auto mb-6 sm:mb-8"
                                loop
                                onMouseEnter={() => autoplayPlugin.current.stop()}
                                onMouseLeave={() => autoplayPlugin.current.reset()}
                            >
                                <CarouselContent>
                                    {[
                                        { id: 1, title: 'Promo Oli Mesin', image: '/images/bbm.jpg' },
                                        { id: 2, title: 'Promo Bahan Bakar', image: '/images/bbm.jpg' },
                                        { id: 3, title: 'Kendaraan Optimal', image: '/images/bbm.jpg' },
                                    ].map((item) => (
                                        <CarouselItem key={item.id}>
                                            <div className="p-2">
                                                <Card>
                                                    <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.title} 
                                                            className="w-full h-48 sm:h-64 object-cover rounded-md mb-3 sm:mb-4" 
                                                        />
                                                        <span className="text-base sm:text-lg font-semibold">{item.title}</span>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>

                            {/* Product Grid Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
                                {/* Card Oli Mesin */}
                                <div className="border bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col items-center">
                                    <h2 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3">Oli Mesin</h2>
                                    <img
                                        src='/images/Pertamina Lubricants.jpg'
                                        alt='Oli Mesin'
                                        className="w-full h-48 sm:h-72 object-cover rounded-md border mb-2 sm:mb-4"
                                    />
                                    <p className="w-3/5 text-gray-600 text-center text-sm sm:text-base mb-3 sm:mb-4">
                                        Pilihan oli berkualitas tinggi untuk menjaga performa mesin.
                                    </p>
                                    <Link href="/oli-mesin" className="bg-blue-500 text-white text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-md hover:bg-blue-600">
                                        Beli Oli Mesin
                                    </Link>
                                </div>

                                {/* Card Bahan Bakar */}
                                <div className="border bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col items-center">
                                    <h2 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3">Bahan Bakar Khusus</h2>
                                    <img
                                        src='/images/Pertamina.png'
                                        alt='BBK'
                                        className="w-full h-48 sm:h-72 object-cover rounded-md border mb-2 sm:mb-4"
                                    />
                                    <p className="w-3/5 text-gray-600 text-center text-sm sm:text-base mb-3 sm:mb-4">
                                        Bahan bakar berkualitas untuk performa maksimal kendaraan Anda.
                                    </p>
                                    <Link href="/bahan-bakar" className="bg-blue-500 text-white text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-md hover:bg-blue-600">
                                        Beli Bahan Bakar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </DynamicLayout>
            )}
        </>
    );
}
