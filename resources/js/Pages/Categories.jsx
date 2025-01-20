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


const categories =[
    {
        no: "1",
        name: "Oli",
    },
    {
        no: "2",
        name: "Bahan Bakar Khusus",
    },
];

export default function Categories(){
    return (
        <>
            <AdminLayout
                header={<h1>Categories</h1>}
                children={
                    <>
                        <Head title="Categories - Admin" />
                        <div className="max-w-screen-xl mx-auto p-6">
                            <div>
                                <button className="bg-white flex flex-row w-20 h-6 rounded-md shadow justify-center">
                                    <span className="my-auto">
                                        <FaPlus className="w-3 h-3"/>
                                    </span>
                                    <div>
                                        <p>Add</p>
                                    </div>
                                </button>
                            </div>
                            <Card className="mt-4">
                                <CardHeader>
                                    <CardTitle>
                                        Categories
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                <table className="table-auto w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Category Name</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        {categories.map((category) => (
                                        <tbody key={category.name}>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">{category.no}</td>
                                                <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <button className="text-blue-500 hover:underline mr-2">Edit</button>
                                                    <button className="text-red-500 hover:underline">Delete</button>
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