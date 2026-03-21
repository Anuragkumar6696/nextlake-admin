"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Code, ImageIcon, FileText, ChevronLeft, ChevronRight } from "lucide-react";
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
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/viewblog`);
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
    if (!confirm("Delete this blog?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
      method: "DELETE",
    });
    fetchBlogs();
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

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${editingSlug}/image`, {
      method: "PATCH",
      body: formData,
    });

    setShowImageModal(false);
    setSelectedImage(null);
    fetchBlogs();
  };

  useEffect(() => {
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  if (currentPage > totalPages) {
    setCurrentPage(totalPages || 1);
  }
}, [filteredBlogs, currentPage]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blogs</h1>
          <p className="text-sm text-gray-500">Manage and publish blog content</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow"
        >
          + Add Blog
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search by title or author"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full mb-6 px-5 py-4 rounded-xl border shadow"
      />

      {/* EMPTY */}
      {!loading && filteredBlogs.length === 0 && (
        <div className="bg-white rounded-2xl p-14 text-center shadow">
          <FileText size={40} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold">No Blogs Found</h3>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {!loading && filteredBlogs.length > 0 && (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-6 text-left">Title</th>
                  <th className="p-6 text-left">Author</th>
                  <th className="p-6 text-center">Date</th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-blue-50">
                    <td className="p-6 font-semibold">{blog.title}</td>
                    <td className="p-6">{blog.author}</td>
                    <td className="p-6 text-center">
                      {new Date(blog.datePublished).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEdit(blog.slug)}><Edit size={18} /></button>
                        <button onClick={() => handleDelete(blog.slug)}><Trash2 size={18} /></button>
                        <button onClick={() => { setEditingSlug(blog.slug); setHtmlContent(blog.content); setShowHtmlEditor(true); }}>
                          <Code size={18} />
                        </button>
                        <button onClick={() => { setEditingSlug(blog.slug); setShowImageModal(true); }}>
                          <ImageIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-6 mt-6">
            {paginatedBlogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-xl font-bold">{blog.title}</h3>
                <p className="text-gray-600">By {blog.author}</p>
                <p className="text-sm text-gray-400">
                  {new Date(blog.datePublished).toLocaleDateString()}
                </p>
                <div className="flex gap-3 mt-4 flex-wrap">
                  <button onClick={() => handleEdit(blog.slug)}>Edit</button>
                  <button onClick={() => handleDelete(blog.slug)}>Delete</button>
                  <button onClick={() => { setEditingSlug(blog.slug); setHtmlContent(blog.content); setShowHtmlEditor(true); }}>HTML</button>
                  <button onClick={() => { setEditingSlug(blog.slug); setShowImageModal(true); }}>Image</button>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION (DESKTOP + MOBILE) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border rounded disabled:opacity-40"
              >
                <ChevronLeft />
              </button>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 border rounded disabled:opacity-40"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* ADD BLOG */}
      {showAddModal && (
        <AddBlog
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchBlogs}
          existingBlog={editingBlog}
        />
      )}

      {/* HTML EDITOR */}
      {showHtmlEditor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="w-full h-72 border rounded-lg p-4 font-mono"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowHtmlEditor(false)}>Cancel</button>
              <button
                onClick={async () => {
                  const cleaned = htmlContent.replace(/&nbsp;/g, " ").trim();
                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${editingSlug}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: cleaned }),
                  });
                  setShowHtmlEditor(false);
                  fetchBlogs();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <input type="file" onChange={(e) => e.target.files && setSelectedImage(e.target.files[0])} />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowImageModal(false)}>Cancel</button>
              <button onClick={handleUpdateImage} className="bg-blue-600 text-white px-4 py-2 rounded">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
