import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { FaPlus } from "react-icons/fa";

const transactions =[
    {
        no: "1",
        name: "Daffa Adriansyah",
        total: "100.000",
        status: "Paid",
        createdAt: "Monday, 20 January 2025",
    },
    {
        no: "2",
        name: "Rizal Adiyanto",
        total: "50.000",
        status: "Paid",
        createdAt: "Monday, 20 January 2025",
    },
    {
        no: "3",
        name: "Arya Ajisadda",
        total: "80.000",
        status: "Paid",
        createdAt: "Monday, 20 January 2025",
    },
    {
        no: "4",
        name: "Fikri Firdaus",
        total: "90.000",
        status: "Paid",
        createdAt: "Monday, 20 January 2025",
    },
];

export default function Transactions(){
    return (
        <>
            <AdminLayout
                header={<h1>Transactions</h1>}
                children={
                    <>
                        <Head title="Transactions - Admin" />
                        <div className="max-w-screen-xl mx-auto p-6">
                            <Card className="mt-4">
                                <CardHeader>
                                    <CardTitle>
                                        Transactions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                <table className="table-auto w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        {transactions.map((transaction) => (
                                        <tbody key={transaction.name}>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">{transaction.no}</td>
                                                <td className="border border-gray-300 px-4 py-2">{transaction.name}</td>
                                                <td className="border border-gray-300 px-4 py-2">{transaction.total}</td>
                                                <td className="border border-gray-300 px-4 py-2">{transaction.status}</td>
                                                <td className="border border-gray-300 px-4 py-2">{transaction.createdAt}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <button className="text-blue-500 hover:underline mr-2">Detail</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                        ))}
                                    </table>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                }
            />
        </>
    )
}