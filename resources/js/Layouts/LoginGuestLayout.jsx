import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function LoginGuestLayout({ children }) {
    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: "url('/images/backgroundsms.jpg')",
            }}
        >
            {/* Lapisan blur */}
            <div className="absolute inset-0 bg-black/25 backdrop-blur-sm"></div>

            {/* Konten login */}
            <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 sm:mt-0">
                <div className="flex justify-center mb-4">
                    <Link href="/">
                        <ApplicationLogo img="logoSMS2.png" className="h-40 w-auto" />
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}