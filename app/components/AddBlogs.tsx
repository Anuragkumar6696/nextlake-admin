"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags?: string;
  coverImage?: string;
  schemaMarkup?: string[];
}

const AddBlog = ({
  onClose,
  onSuccess,
  existingBlog = null,
}: {
  onClose: () => void;
  onSuccess: () => void;
  existingBlog?: BlogPost | null;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    tags: "",
    coverImage: null as File | null,
    schemaMarkup: [""],
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingBlog) {
      setFormData({
        title: existingBlog.title,
        slug: existingBlog.slug,
        excerpt: existingBlog.excerpt,
        content: existingBlog.content,
        author: existingBlog.author,
        tags: existingBlog.tags || "",
        coverImage: null,
        schemaMarkup: existingBlog.schemaMarkup?.length
          ? existingBlog.schemaMarkup
          : [""],
      });
    }
  }, [existingBlog]);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: [] }],
    ["link"],
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Auto-generate slug if creating new blog
    if (name === "title" && !existingBlog) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: autoSlug,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const blogData = new FormData();
      blogData.append("title", formData.title);
      blogData.append("slug", formData.slug);
      blogData.append("excerpt", formData.excerpt);
      blogData.append("content", formData.content);
      blogData.append("author", formData.author);
      blogData.append("tags", formData.tags);

      if (formData.coverImage) {
        blogData.append("coverImage", formData.coverImage);
      } else if (!existingBlog) {
        alert("Cover image is required for new blog.");
        setSubmitting(false);
        return;
      }

      formData.schemaMarkup.forEach((schema) =>
        blogData.append("schemaMarkup", schema)
      );

      const url = existingBlog
        ? `${process.env.NEXT_PUBLIC_API_URL}/blog/${existingBlog.slug}`
        : `${process.env.NEXT_PUBLIC_API_URL}/blog/add`;

      const method = existingBlog ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: blogData, // ❌ DO NOT set content-type, browser sets it automatically for FormData
      });

      const data = await res.json();

      if (res.ok) {
        alert(existingBlog ? "Blog updated successfully" : "Blog added successfully");
        onSuccess();
        onClose();
      } else {
        alert(data.error || data.msg || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting blog:", err);
      alert("Network or server error. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 max-w-2xl w-full rounded-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
          {existingBlog ? "Edit Blog" : "Add New Blog"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full p-2 border"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            className="w-full p-2 border"
            value={formData.slug}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="excerpt"
            placeholder="Meta description"
            className="w-full p-2 border"
            value={formData.excerpt}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block font-medium mb-2">Blog Content</label>
            <div className="border rounded overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                modules={{ toolbar: toolbarOptions }}
                className="react-quill-editor"
              />
            </div>
          </div>

          <input
            type="text"
            name="author"
            placeholder="Author"
            className="w-full p-2 border"
            value={formData.author}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            className="w-full p-2 border"
            value={formData.tags}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleImageChange}
            required={!existingBlog}
          />

          <div>
            <label className="block font-medium mb-2">Schema Markup (JSON-LD)</label>
            {formData.schemaMarkup.map((markup, index) => (
              <textarea
                key={index}
                rows={3}
                className="w-full p-2 border mb-2"
                placeholder={`Schema Markup ${index + 1}`}
                value={markup}
                onChange={(e) => {
                  const updated = [...formData.schemaMarkup];
                  updated[index] = e.target.value;
                  setFormData((prev) => ({ ...prev, schemaMarkup: updated }));
                }}
              />
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, schemaMarkup: [...prev.schemaMarkup, ""] }))
                }
              >
                + Add Schema
              </button>
              {formData.schemaMarkup.length > 1 && (
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      schemaMarkup: prev.schemaMarkup.slice(0, -1),
                    }))
                  }
                >
                  – Remove Last
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded text-white ${
                submitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? (existingBlog ? "Updating..." : "Adding...") : existingBlog ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
