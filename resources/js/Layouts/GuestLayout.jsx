import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <nav className="border-b border-gray-100 bg-white py-2">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex shrink-0 items-center">
                            <Link href="/">
                                <ApplicationLogo img="logoSMS.jpg" className="h-14 w-auto fill-current text-white" />
                            </Link>
                            <h2 className='ml-2 font-semibold'>SMS Shop</h2>
                        </div>

                        <div className='justify-end space-x-3 sm:flex sm:items-center sm:gap-4'>
                            <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900">
                                Log In
                            </Link>
                            <Link href="/register" className="ml-4 text-sm text-gray-700 hover:text-gray-900">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="w-full">{children}</main>

            <footer className="bg-white py-10 bottom-0">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        {/* Section 1: Company Info */}
                        <div className="w-full sm:w-1/2 mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                PT. Sidorejo Makmur Sejahtera
                            </h1>
                            <p className="mt-2 text-gray-600">Lorem ipsum dolor sit amet</p>
                        </div>

                        {/* Section 2: Navigation */}
                        <div className="w-full sm:w-1/4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><Link href="/dashboard" className="hover:text-blue-600">Home</Link></li>
                                <li><Link href="/oli-mesin" className="hover:text-blue-600">Oli Mesin</Link></li>
                                <li><Link href="/bahan-bakar" className="hover:text-blue-600">Bahan Bakar Khusus</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">FAQ</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Blog</Link></li>
                            </ul>
                        </div>

                        {/* Section 3: Contact */}
                        <div className="w-full sm:w-1/4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company</h3>
                            <a href="mailto:john@example.com" className="text-blue-600 hover:underline">
                                john@example.com
                            </a>
                            <p className="mt-2 text-gray-600">
                                Jl. Raya Semarang-Demak, Bandung Rejo, Demak
                            </p>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-10 flex flex-col sm:flex-row justify-between items-center border-t pt-6">
                        <p className="text-gray-600 text-center sm:text-left">
                            &copy; 2025 SMS Shop. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}