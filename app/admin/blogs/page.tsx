"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Code, ImageIcon, FileText, ChevronLeft, ChevronRight, Eye, Search, Plus, Calendar, User } from "lucide-react";
import dynamic from "next/dynamic";
import Fuse from "fuse.js";

const AddBlog = dynamic(() => import("../../components/AddBlogs"), { ssr: false });

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  datePublished: string;
  slug: string;
  coverImage: string; 
  views?: number;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  const [showHtmlEditor, setShowHtmlEditor] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/viewblog`);
      const data = await res.json();
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= SEARCH ================= */
  const fuse = new Fuse(blogs, { keys: ["title", "author"], threshold: 0.3 });
  const filteredBlogs =
    searchQuery.trim() === ""
      ? blogs
      : fuse.search(searchQuery).map((r) => r.item);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= ACTIONS ================= */
  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`, {
        method: "DELETE",
      });
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  const handleEdit = (slug: string) => {
    const blog = blogs.find((b) => b.slug === slug);
    if (blog) {
      setEditingBlog(blog);
      setShowAddModal(true);
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedImage || !editingSlug) return;
    const formData = new FormData();
    formData.append("coverImage", selectedImage);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${editingSlug}/image`, {
        method: "PATCH",
        body: formData,
      });
      setShowImageModal(false);
      setSelectedImage(null);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to update image:", err);
    }
  };

  const handleViewClick = (views: number = 0) => {
    alert(`This blog has ${views} total views.`);
  };

  useEffect(() => {
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredBlogs, currentPage]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Blog Management</h1>
          <p className="text-gray-500 mt-2 font-medium">Create, edit, and manage your published content</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1 font-bold text-lg"
        >
          <Plus size={24} />
          Add New Blog
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group mb-10">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search size={22} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          placeholder="Search blogs by title or author name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-16 pr-6 py-5 rounded-3xl border-none bg-white shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 text-lg placeholder:text-gray-400 font-medium"
        />
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-bold text-xl">Loading your stories...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredBlogs.length === 0 && (
        <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-gray-100">
          <div className="bg-gray-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <FileText size={48} className="text-gray-300" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-4">No Blogs Found</h3>
          <p className="text-gray-500 text-lg max-w-md mx-auto font-medium">We couldn't find any blogs matching your search. Try a different keyword or create a new post!</p>
        </div>
      )}

      {/* CONTENT */}
      {!loading && filteredBlogs.length > 0 && (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-400 uppercase tracking-widest">Blog Title</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-400 uppercase tracking-widest">Author</th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">Published</th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">Views</th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <FileText size={20} />
                        </div>
                        <span className="font-bold text-gray-900 line-clamp-1">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-600 font-semibold">
                        <User size={16} className="text-gray-400" />
                        {blog.author}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500 font-medium">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(blog.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => handleViewClick(blog.views)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-600 font-bold hover:bg-purple-100 transition-colors"
                      >
                        <Eye size={16} />
                        {blog.views || 0}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => handleEdit(blog.slug)}
                          className="p-3 rounded-xl text-blue-600 hover:bg-blue-100 transition-all"
                          title="Edit Blog"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => { setEditingSlug(blog.slug); setHtmlContent(blog.content); setShowHtmlEditor(true); }}
                          className="p-3 rounded-xl text-green-600 hover:bg-green-100 transition-all"
                          title="HTML Editor"
                        >
                          <Code size={20} />
                        </button>
                        <button 
                          onClick={() => { setEditingSlug(blog.slug); setShowImageModal(true); }}
                          className="p-3 rounded-xl text-orange-600 hover:bg-orange-100 transition-all"
                          title="Change Image"
                        >
                          <ImageIcon size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(blog.slug)}
                          className="p-3 rounded-xl text-red-600 hover:bg-red-100 transition-all"
                          title="Delete Blog"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE & TABLET CARDS */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedBlogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <FileText size={24} />
                  </div>
                  <button 
                    onClick={() => handleViewClick(blog.views)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 font-bold text-sm"
                  >
                    <Eye size={14} />
                    {blog.views || 0}
                  </button>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2 leading-tight">{blog.title}</h3>
                
                <div className="space-y-2 mb-6 mt-auto">
                  <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                    <User size={14} className="text-gray-400" />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(blog.datePublished).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => handleEdit(blog.slug)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.slug)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button 
                    onClick={() => { setEditingSlug(blog.slug); setHtmlContent(blog.content); setShowHtmlEditor(true); }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 text-green-600 font-bold text-sm hover:bg-green-100 transition-colors"
                  >
                    <Code size={16} /> HTML
                  </button>
                  <button 
                    onClick={() => { setEditingSlug(blog.slug); setShowImageModal(true); }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-50 text-orange-600 font-bold text-sm hover:bg-orange-100 transition-colors"
                  >
                    <ImageIcon size={16} /> Image
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all duration-300 shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Page</span>
                <span className="text-gray-900 font-black text-lg">{currentPage}</span>
                <span className="text-gray-300 font-bold">/</span>
                <span className="text-gray-500 font-bold">{totalPages}</span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all duration-300 shadow-sm"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </>
      )}

      {/* MODALS (UNCHANGED LOGIC) */}
      {showAddModal && (
        <AddBlog
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchBlogs}
          existingBlog={editingBlog}
        />
      )}

      {/* HTML EDITOR MODAL */}
      {showHtmlEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-4xl shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">HTML Editor</h3>
              <button onClick={() => setShowHtmlEditor(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                <ChevronLeft className="rotate-180" size={24} />
              </button>
            </div>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="w-full h-96 p-6 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 font-mono text-sm mb-6 focus:outline-none transition-all"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowHtmlEditor(false)}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${editingSlug}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: htmlContent }),
                  });
                  setShowHtmlEditor(false);
                  fetchBlogs();
                }}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Update Cover Image</h3>
            <div className="mb-8">
              <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative overflow-hidden group">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="font-bold">{selectedImage ? selectedImage.name : "Select Image File"}</span>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateImage}
                disabled={!selectedImage}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
