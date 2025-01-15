import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { LuLoader } from "react-icons/lu";
import { IoMdCheckmark } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function AdminDashboard() {

    const options = {
        animationEnabled: true,
        colorSet: "colorSet2",
        title: {
            text: "Monthly Sales"
        },
        axisX: {
            valueFormatString: "MMMM"
        },
        axisY: {
            prefix: "$",
            labelFormatter: (e) => {
                const suffixes = ["", "K", "M", "B"];
                let order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);
                order = order > suffixes.length - 1 ? suffixes.length - 1 : order;
                return CanvasJSReact.CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffixes[order];
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: (e) => {
                if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            },
            verticalAlign: "top"
        },
        data: [{
            type: "column",
            name: "Actual Sales",
            showInLegend: true,
            xValueFormatString: "MMMM YYYY",
            yValueFormatString: "$#,##0",
            dataPoints: [
                { x: new Date(2017, 0), y: 27500 },
                { x: new Date(2017, 1), y: 29000 },
                { x: new Date(2017, 2), y: 22000 },
                { x: new Date(2017, 3), y: 26500 },
                { x: new Date(2017, 4), y: 33000 },
                { x: new Date(2017, 5), y: 37000 },
                { x: new Date(2017, 6), y: 32000 },
                { x: new Date(2017, 7), y: 27500 },
                { x: new Date(2017, 8), y: 29500 },
                { x: new Date(2017, 9), y: 43000 },
                { x: new Date(2017, 10), y: 55000, indexLabel: "High Renewals" },
                { x: new Date(2017, 11), y: 39500 }
            ]
        }, {
            type: "line",
            name: "Expected Sales",
            showInLegend: true,
            yValueFormatString: "$#,##0",
            dataPoints: [
                { x: new Date(2017, 0), y: 38000 },
                { x: new Date(2017, 1), y: 39000 },
                { x: new Date(2017, 2), y: 35000 },
                { x: new Date(2017, 3), y: 37000 },
                { x: new Date(2017, 4), y: 42000 },
                { x: new Date(2017, 5), y: 48000 },
                { x: new Date(2017, 6), y: 41000 },
                { x: new Date(2017, 7), y: 38000 },
                { x: new Date(2017, 8), y: 42000 },
                { x: new Date(2017, 9), y: 45000 },
                { x: new Date(2017, 10), y: 48000 },
                { x: new Date(2017, 11), y: 47000 }
            ]
        }, {
            type: "area",
            name: "Profit",
            markerBorderColor: "white",
            markerBorderThickness: 2,
            showInLegend: true,
            yValueFormatString: "$#,##0",
            dataPoints: [
                { x: new Date(2017, 0), y: 11500 },
                { x: new Date(2017, 1), y: 10500 },
                { x: new Date(2017, 2), y: 9000 },
                { x: new Date(2017, 3), y: 13500 },
                { x: new Date(2017, 4), y: 13890 },
                { x: new Date(2017, 5), y: 18500 },
                { x: new Date(2017, 6), y: 16000 },
                { x: new Date(2017, 7), y: 14500 },
                { x: new Date(2017, 8), y: 15880 },
                { x: new Date(2017, 9), y: 24000 },
                { x: new Date(2017, 10), y: 31000 },
                { x: new Date(2017, 11), y: 19000 }
            ]
        }]
    };
    return (
        <>
            <AdminLayout
                header={<h1> Dashboard Admin</h1>}
                children={
                    <>
                        <Head title="Dashboard Admin" />
                        <div className="max-w-screen-xl mx-auto p-6">
                            <div className="flex flex-row justify-evenly">
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <LuLoader className="w-10 h-10 text-blue-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>2</h2>
                                        <p>Unpaid</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <IoMdCheckmark className="w-10 h-10 text-green-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>7</h2>
                                        <p>Paid</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <IoWarningOutline className="w-10 h-10 text-yellow-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>0</h2>
                                        <p>Expired</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <RxCrossCircled className="w-10 h-10 text-red-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>0</h2>
                                        <p>Cancelled</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white mt-8 p-6 rounded-md shadow">
                                <CanvasJSChart options={options} />
                            </div>
                        </div>
                    </>
                }
                
            />
        </>
    );
}
