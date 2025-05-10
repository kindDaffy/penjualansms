import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Head } from '@inertiajs/react';

export default function CheckoutPayment() {
    const location = useLocation();
    const { snapToken, order } = location.state || {}; // Mengambil snapToken dan order dari state

    useEffect(() => {
        if (!snapToken) {
            alert("Snap Token tidak ditemukan!");
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY); // Ambil client key dari environment
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.snap.pay(snapToken, {
                onSuccess: (result) => {
                    console.log('Success:', result);
                    window.location.href = '/'; // Redirect ke halaman konfirmasi atau sukses
                },
                onPending: (result) => {
                    console.log('Pending:', result);
                },
                onError: (result) => {
                    console.error('Error:', result);
                },
                onClose: () => {
                    alert('Kamu belum menyelesaikan pembayaran!');
                }
            });
        };

        return () => document.body.removeChild(script); // Cleanup the script when component is unmounted
    }, [snapToken]);

    return (
        <>
            <Head title="Pembayaran" />
            <div className="text-center mt-10">
                <p>Menyiapkan pembayaran untuk order <strong>{order?.code}</strong>...</p>
            </div>
        </>
    );
}