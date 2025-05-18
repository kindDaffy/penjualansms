import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { usePage } from '@inertiajs/react';

export default function DynamicLayout({ children }) {
    const { auth } = usePage().props;

    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return <Layout auth={auth}>{children}</Layout>;
}