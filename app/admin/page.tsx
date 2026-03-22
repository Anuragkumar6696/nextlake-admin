"use client";

import { useEffect, useState } from "react";
import { FileText, Users, LayoutDashboard, TrendingUp, Eye, Calendar } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import Link from "next/link";

export default function AdminDashboardPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [totalViews, setTotalViews] = useState(0);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/blog/viewblog`
                );
                const data = await res.json();
                
                // Assuming data is an array of blogs
                const blogsData = Array.isArray(data) ? data : [];
                setBlogs(blogsData);

                let viewsCount = 0;
                const map: any = {};

                blogsData.forEach((b: any) => {
                    // Use b.views if available, otherwise 0
                    const v = b.views || 0;
                    viewsCount += v;

                    const d = new Date(b.datePublished).toLocaleDateString();
                    map[d] = (map[d] || 0) + 1;
                });

                setTotalViews(viewsCount);

                const sortedDates = Object.keys(map).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
                
                setChartData(
                    sortedDates.map((d) => ({
                        date: d,
                        blogs: map[d],
                    }))
                );
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            }
        }

        load();
    }, []);

    return (
        <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2 font-medium">Welcome back! Here's what's happening with your blogs.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Calendar size={20} />
                    </div>
                    <span className="font-semibold text-gray-700 pr-4">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <FileText size={28} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Total</span>
                    </div>
                    <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Total Blogs</h3>
                    <p className="text-4xl font-black text-gray-900 mt-2">{blogs.length}</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <Eye size={28} />
                        </div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">Engagement</span>
                    </div>
                    <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Total Views</h3>
                    <p className="text-4xl font-black text-gray-900 mt-2">{totalViews}</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <TrendingUp size={28} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">Performance</span>
                    </div>
                    <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Avg Views/Blog</h3>
                    <p className="text-4xl font-black text-gray-900 mt-2">
                        {blogs.length > 0 ? (totalViews / blogs.length).toFixed(1) : 0}
                    </p>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Publishing Trends</h2>
                        <p className="text-gray-500 font-medium">Blogs published over time</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl">
                        <LayoutDashboard className="text-gray-400" size={24} />
                    </div>
                </div>
                
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#64748b', fontSize: 12}}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#64748b', fontSize: 12}}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    padding: '12px'
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="blogs" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorBlogs)" 
                                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}