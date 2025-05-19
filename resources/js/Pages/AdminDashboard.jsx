import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { LuLoader } from "react-icons/lu";
import { IoMdCheckmark } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { BsCashCoin } from "react-icons/bs";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import React from 'react';
import { usePage } from '@inertiajs/react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const chartData = [
    { month: "January", revenue: 186 },
    { month: "February", revenue: 305 },
    { month: "March", revenue: 237 },
    { month: "April", revenue: 73 },
    { month: "May", revenue: 209 },
    { month: "June", revenue: 214 },
  ];
  
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{label}</p>
        <p className="text-green-600">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  };

export default function AdminDashboard({ recentOrders, orderStats, revenueData, totalRevenue, trendingPercentage, currentYear }) {
    const { auth } = usePage().props;
    if (auth.user.role !== 'admin') {
        return <div>You do not have access to this page.</div>;
    }

    const stats = orderStats || {
    unpaid: 0,
    paid: 0,
    completed: 0,
    cancelled: 0
    };

    // Set default values if revenueData is not provided
    const chartData = revenueData || [];
    const yearTotal = totalRevenue || 0;
    const trending = trendingPercentage || 0;
    const year = currentYear || new Date().getFullYear();

    return (
        <>
            <AdminLayout
                header={<h1> Dashboard Admin</h1>}
                children={
                    <>
                        <Head title="Dashboard Admin" />
                        <div className="max-w-screen-xl mx-auto p-5">
                            <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-4">
                                <Card className="bg-white flex flex-row w-60 h-16 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <LuLoader className="w-10 h-10 text-yellow-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>{stats.unpaid}</h2>
                                        <p>Unpaid</p>
                                    </div>
                                </Card>
                                <Card className="bg-white flex flex-row w-60 h-16 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <BsCashCoin className="w-10 h-10 text-green-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>{stats.paid}</h2>
                                        <p>Paid</p>
                                    </div>
                                </Card>
                                <Card className="bg-white flex flex-row w-60 h-16 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <IoMdCheckmark className="w-10 h-10 text-blue-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>{stats.completed}</h2>
                                        <p>Completed</p>
                                    </div>
                                </Card>
                                <Card className="bg-white flex flex-row w-60 h-16 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <RxCrossCircled className="w-10 h-10 text-red-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>{stats.cancelled}</h2>
                                        <p>Cancelled</p>
                                    </div>
                                </Card>
                            </div>
                            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card>
                            <CardHeader>
                                <CardTitle>Total Revenue {formatCurrency(yearTotal)}</CardTitle>
                                <CardDescription>January - December {year}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="month" 
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <YAxis 
                                            tickFormatter={(value) => `Rp${value / 1000}k`}
                                            width={80}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 font-medium leading-none">
                                    {trending > 0 ? (
                                        <>
                                            Trending up by {trending}% this month <TrendingUp className="h-4 w-4 text-green-500" />
                                        </>
                                    ) : trending < 0 ? (
                                        <>
                                            Trending down by {Math.abs(trending)}% this month <TrendingDown className="h-4 w-4 text-red-500" />
                                        </>
                                    ) : (
                                        <>
                                            No change in trend this month
                                        </>
                                    )}
                                </div>
                                <div className="leading-none text-muted-foreground">
                                    Showing total revenue for {year}
                                </div>
                            </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Sales</CardTitle>
                                    <CardDescription>You made {recentOrders?.length || 0} sales this month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {recentOrders && recentOrders.length > 0 ? (
                                            recentOrders.map((sale, index) => (
                                                <div key={index} className="flex items-center">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage
                                                            src={sale.avatarUrl || ""}
                                                            alt={`${sale.customer_first_name || 'Customer'}`}
                                                        />
                                                        <AvatarFallback>
                                                            {sale.customer_first_name ? sale.customer_first_name[0] : ''}
                                                            {sale.customer_last_name ? sale.customer_last_name[0] : ''}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4 space-y-1 text-sm">
                                                        <p className="font-medium leading-none">
                                                            {sale.customer_first_name} {sale.customer_last_name}
                                                        </p>
                                                        <p className="text-muted-foreground">{sale.customer_email}</p>
                                                    </div>
                                                    <div className="ml-auto font-medium">Rp.{sale.base_total_price}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-muted-foreground">
                                                No recent sales found
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            </div>
                            <div>
                            </div>
                        </div>
                    </>
                }
                
            />
        </>
    );
}
