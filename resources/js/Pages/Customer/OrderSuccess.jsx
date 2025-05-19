import { Link } from '@inertiajs/react';
import { Head } from "@inertiajs/react";

export default function OrderSuccess() {
    const whatsappNumber = '6282314755575';
    const message = encodeURIComponent("Halo admin, saya sudah melakukan pembayaran.");

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Head title="Pembayaran Sukses" />

            <div className="bg-white p-8 rounded shadow text-center max-w-md">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Pembayaran Berhasil 🎉</h2>
                <p className="mb-6">Terima kasih telah melakukan pembelian. Pesanan kamu sedang diproses.</p>

                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Hubungi Admin via WhatsApp
                </a>

                <div className="mt-4">
                    <Link
                        href={route('dashboard')}
                        className="text-blue-500 underline text-sm"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
