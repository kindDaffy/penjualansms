import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FiShoppingCart } from "react-icons/fi";

export default function AuthenticatedLayout({ auth, children }) {
    const user = usePage().props.auth.user;

    const { cart } = usePage().props;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white py-2">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo img="logoSMS.jpg" className="h-14 w-auto fill-current text-white" />
                                </Link>

                                <h2 className='ml-2 font-semibold'>SMS Shop</h2>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className='relative'>
                                <NavLink href="/cart">
                                    <FiShoppingCart 
                                        className="text-xl"    
                                    />
                                    <span 
                                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs"
                                    >
                                        {cart?.items?.length || 0}
                                    </span>
                                </NavLink>
                            </div>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('checkout.history')}
                                        >
                                            Riwayat Pembelian
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('checkout.history')}>
                                Riwayat Pembelian
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            <footer className="bg-white py-10 bottom-0">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        {/* Section 1: Company Info */}
                        <div className="w-full sm:w-1/2 mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                PT. Sidorejo Makmur Sejahtera
                            </h1>
                            <p className="mt-2 text-gray-600">
                                PT Sidorejo Makmur Sejahtera merupakan perusahaan yang bergerak di bidang migas dan retail, dengan komitmen untuk menyediakan layanan energi dan kebutuhan sehari-hari yang berkualitas bagi masyarakat.
                            </p>
                        </div>

                        {/* Section 2: Navigation */}
                        <div className="w-full sm:w-1/4 mb-6 pl-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><Link href="/dashboard" className="hover:text-blue-600">Home</Link></li>
                                <li><Link href="/oli-mesin" className="hover:text-blue-600">Oli Mesin</Link></li>
                                <li><Link href="/bahan-bakar" className="hover:text-blue-600">Bahan Bakar Khusus</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Blog</Link></li>
                            </ul>
                        </div>

                        {/* Section 3: Contact */}
                        <div className="w-full sm:w-1/4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company</h3>
                            <a href="mailto:sidorejomakmursejahera@gmail.com" className="text-blue-600 hover:underline">
                                sidorejomakmursejahera@gmail.com
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
