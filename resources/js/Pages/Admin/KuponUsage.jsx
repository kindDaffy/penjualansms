import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import ReactPaginate from "react-paginate";
import { FaArrowLeft } from "react-icons/fa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function UsageDetails({ coupon, usages }) {
    const [currentPage, setCurrentPage] = useState(0);

    // Pagination configuration
    const itemsPerPage = 10;
    const offset = currentPage * itemsPerPage;
    const paginatedUsages = usages.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(usages.length / itemsPerPage);

    // Handle page change for pagination
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <AdminLayout header={<h1>Coupon Usage Details</h1>}>
            <Head title={`Coupon ${coupon.code} - Usage Details`} />
            <div className="max-w-screen-xl mx-auto p-6">
                <div className="mb-6">
                    <Link
                        href={route("coupons.index")}
                        className="flex items-center text-blue-500 hover:text-blue-700"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Coupons
                    </Link>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Coupon Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Code</h3>
                                <p className="text-lg font-bold">{coupon.code}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Discount</h3>
                                <p className="text-lg">
                                    {coupon.discount_percent ? `${coupon.discount_percent}%` : ''}
                                    {coupon.discount_percent && coupon.discount_amount ? ' / ' : ''}
                                    {coupon.discount_amount ? `Rp ${coupon.discount_amount.toLocaleString()}` : ''}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Valid Until</h3>
                                <p className="text-lg">{coupon.valid_until || 'No Expiry'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Quota</h3>
                                <p className="text-lg">{coupon.quota || 'Unlimited'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Usage Count</h3>
                                <p className="text-lg">{usages.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Usage History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Used On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsages.length > 0 ? (
                                    paginatedUsages.map((usage, index) => (
                                        <tr key={usage.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">
                                                {offset + index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {usage.user_name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {usage.user_email}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {usage.created_at}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">
                                            This coupon has not been used yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {pageCount > 1 && (
                            <div className="mt-6">
                                <ReactPaginate
                                    previousLabel={"← Sebelumnya"}
                                    nextLabel={"Selanjutnya →"}
                                    pageCount={pageCount}
                                    onPageChange={handlePageChange}
                                    containerClassName={"flex justify-center mt-4 space-x-2"}
                                    pageClassName={"px-3 py-1 border rounded-md"}
                                    previousClassName={"px-4 py-2"}
                                    nextClassName={"px-4 py-2"}
                                    activeClassName={"bg-blue-500 text-white font-bold"}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}