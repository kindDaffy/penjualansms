import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CgHomeAlt } from "react-icons/cg";
import { FaFolder } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { IoPeopleSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";

export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className='w-56 bg-blue-950'>
                <div className='h-16 flex items-center justify-center'>
                    <Link href={route("admin")}>
                        <ApplicationLogo img="logoSMS.jpg" className="h-10 w-auto fill-current text-white" />
                    </Link>
                </div>
                <nav className="flex flex-col mt-10 space-y-2 px-2">   
                    <NavLink
                        href={route("admin")}
                        className="block px-6 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <CgHomeAlt className="mr-2" />
                        Home
                    </NavLink>
                    <NavLink
                        href={route("categories.index")}
                        className="block px-6 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <FaFolder className="mr-2"/>
                        Categories
                    </NavLink>
                    <NavLink
                        href={route("products.index")}
                        className="block px-6 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <MdShoppingBag className="mr-2"/>
                        Products
                    </NavLink>
                    <NavLink
                        href={route("transaction.index")}
                        className="block px-6 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <RiShoppingCart2Fill className="mr-2"/>
                        Transactions
                    </NavLink>
                    <NavLink
                        href={route("users.index")}
                        className="block px-6 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <IoPeopleSharp className="mr-2"/>
                        Users
                    </NavLink>
                    <NavLink
                        href={route("laporan.index")}
                        className="block px-6 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <TbReportSearch className="mr-2"/>
                        Laporan
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-md">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        {header && (
                            <header>
                                <div className="text-2xl font-bold text-blue-950">
                                    {header}
                                </div>
                            </header>
                        )}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {/* Dropdown */}
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
                    </div>
                </header>

            {/* Main Body Content*/}
            <main className="p-6 flex-1 overflow-y-auto bg-gray-100">
                <div>
                    {children}
                </div>
            </main>
        </div>
    </div>
    );
}
