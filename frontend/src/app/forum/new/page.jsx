'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDiscussionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/forum/categories`);
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id); // Default to first category
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!categoryId) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/forum/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          categoryId: parseInt(categoryId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      router.push('/forum');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen canvas-texture py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full glass-card p-10 rounded-3xl animate-fadeInUp">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b-2 border-art-purple-100 pb-4">
          Start a New Discussion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title Input */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-6 py-4 bg-white/50 border-2 border-gray-200 rounded-2xl focus:border-art-purple-500 focus:ring-4 focus:ring-art-purple-100 outline-none transition-all text-lg"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Category</label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-6 py-4 bg-white/50 border-2 border-gray-200 rounded-2xl focus:border-art-purple-500 focus:ring-4 focus:ring-art-purple-100 outline-none transition-all text-lg appearance-none cursor-pointer"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-xl">
                ▼
              </div>
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Content</label>
            <textarea
              placeholder="Share your thoughts, questions, or artwork..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-6 py-4 bg-white/50 border-2 border-gray-200 rounded-2xl focus:border-art-purple-500 focus:ring-4 focus:ring-art-purple-100 outline-none transition-all text-lg resize-none"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 btn-primary text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Discussion 🚀'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
