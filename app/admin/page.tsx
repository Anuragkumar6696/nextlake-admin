"use client";

import { useEffect, useState } from "react";
import { FileText, Users, LayoutDashboard } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Blog {
  _id: string;
  datePublished: string;
}

interface ChartData {
  date: string;
  blogs: number;
}

export default function AdminDashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blog/viewblog`
        );

        const data: Blog[] = await res.json();
        setBlogs(data);

        const map: Record<string, number> = {};

        data.forEach((b) => {
          const d = new Date(b.datePublished).toLocaleDateString();
          map[d] = (map[d] || 0) + 1;
        });

        const arr = Object.keys(map).map((d) => ({
          date: d,
          blogs: map[d],
        }));

        setChartData(arr);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* ✅ SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Admin</h2>

        <nav className="space-y-3">

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800">
            <LayoutDashboard size={20} />
            Dashboard
          </div>

          {/* ⭐ BLOG NAVBAR SECTION */}
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
            <FileText size={20} />
            Blogs
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
            <Users size={20} />
            Leads
          </div>

        </nav>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 bg-gray-50 p-8">

        <h1 className="text-3xl font-bold mb-6">Blog Analytics</h1>

        {/* BLOG CARD */}
        <div className="bg-blue-600 text-white p-6 rounded-3xl w-60 mb-10">
          <p>Total Blogs</p>
          <h2 className="text-3xl font-bold">
            {loading ? "..." : blogs.length}
          </h2>
        </div>

        {/* BLOG CHART */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">Blogs Over Time</h3>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="blogs"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No Blog Data</p>
          )}
        </div>

      </div>
    </div>
  );
}