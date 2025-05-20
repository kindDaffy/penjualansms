import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FiPrinter } from "react-icons/fi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GoDownload } from "react-icons/go";

export default function Index() {
    const [bulan, setBulan] = useState("")
    const [tahun, setTahun] = useState("")
    const handleCetak = () => {
        if (!bulan || !tahun) {
            alert("Silakan pilih bulan dan tahun terlebih dahulu");
            return;
        }
        
        // Open in new tab
        window.open(`/admin/laporan-penjualan/print?bulan=${bulan}&tahun=${tahun}`, '_blank');
    };

    const handleExport = () => {
        if (!bulan || !tahun) {
            alert("Silakan pilih bulan dan tahun terlebih dahulu");
            return;
        }
        
        // Trigger download
        window.location.href = `/admin/laporan-penjualan/export?bulan=${bulan}&tahun=${tahun}`;
    };

    const bulanOptions = [
        { value: "01", label: "Januari" },
        { value: "02", label: "Februari" },
        { value: "03", label: "Maret" },
        { value: "04", label: "April" },
        { value: "05", label: "Mei" },
        { value: "06", label: "Juni" },
        { value: "07", label: "Juli" },
        { value: "08", label: "Agustus" },
        { value: "09", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" },
    ]

    const tahunOptions = [
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
    ]
    return (
        <AdminLayout header={<h1>Laporan Penjualan</h1>}>
            <Head title="Laporan - Admin"/>
            <div className="max-w-screen-xl mx-auto p-6">
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Laporan Penjualan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                            <Select value={bulan} onValueChange={setBulan}>
                                <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                {bulanOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            </div>

                            <div>
                            <Select value={tahun} onValueChange={setTahun}>
                                <SelectTrigger className="w-full">
                                <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                {tahunOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                            <Button onClick={handleCetak} className="w-full bg-green-500 hover:bg-green-600">
                                <FiPrinter  className="mr-2 h-4 w-4" /> Cetak
                            </Button>
                            <Button onClick={handleExport} className="w-full bg-blue-500 hover:bg-blue-600">
                                <GoDownload className="mr-2 h-4 w-4" /> Export to Excel
                            </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
