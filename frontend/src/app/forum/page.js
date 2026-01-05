'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { id: 'general', name: 'General Discussion', emoji: '💬', color: 'bg-art-blue-50 text-art-blue-600 border-art-blue-100' },
  { id: 'showcase', name: 'Show & Tell', emoji: '🎨', color: 'bg-art-purple-50 text-art-purple-600 border-art-purple-100' },
  { id: 'advice', name: 'Art Advice', emoji: '💡', color: 'bg-art-yellow-50 text-art-yellow-600 border-art-yellow-100' },
  { id: 'homework', name: 'Critique Wanted', emoji: '❓', color: 'bg-art-red-50 text-art-red-600 border-art-red-100' },
  { id: 'resources', name: 'Resources', emoji: '📚', color: 'bg-art-green-50 text-art-green-600 border-art-green-100' },
];

export default function ForumPage() {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 🔌 FETCH POSTS FROM NEON BACKEND
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/forum/posts', {
          credentials: 'include',
        });
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to fetch forum posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 🔍 FILTER POSTS
  const filteredPosts = posts.filter(post => {
    const matchesCategory =
      selectedCategory === 'all' ||
      post.category_name?.toLowerCase() === selectedCategory;

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen canvas-texture py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-6xl font-bold text-rainbow mb-2">Community Forum</h1>
            <p className="text-xl text-gray-600">Connect, share, and grow with other artists</p>
          </div>

          <button
            onClick={() => router.push('/forum/new')}
            className="btn-primary flex items-center gap-2 text-lg px-8"
          >
            <span className="text-2xl">+</span> New Discussion
          </button>
        </div>

        {/* CATEGORIES */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-4 rounded-2xl border-2 transition-all text-center ${
              selectedCategory === 'all'
                ? 'bg-art-purple-600 text-white border-transparent shadow-glow-rainbow'
                : 'bg-white border-gray-100 text-gray-600'
            }`}
          >
            <div className="text-2xl mb-1">🌍</div>
            <div className="font-bold">All Topics</div>
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-2xl border-2 transition-all text-center ${
                selectedCategory === cat.id
                  ? `${cat.color} border-transparent shadow-lg scale-105`
                  : 'bg-white border-gray-100 text-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="font-bold">{cat.name}</div>
            </button>
          ))}
        </div>

        {/* POSTS */}
        <div className="glass-card rounded-3xl overflow-hidden">

          {/* SEARCH */}
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-96 px-6 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl"
            />
          </div>

          {/* LOADING */}
          {loading && (
            <div className="p-20 text-center text-xl font-medium text-gray-500">
              Loading discussions…
            </div>
          )}

          {/* POSTS LIST */}
          {!loading && filteredPosts.map(post => (
            <div
              key={post.id}
              onClick={() => router.push(`/forum/${post.id}`)}
              className="p-8 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="hidden md:flex w-14 h-14 bg-gradient-cool rounded-2xl items-center justify-center text-white font-bold text-2xl">
                  {post.author[0].toUpperCase()}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100">
                      {post.category_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900">
                    {post.title}
                  </h3>

                  <p className="text-gray-500">
                    Posted by <span className="text-art-purple-500">{post.author}</span>
                  </p>
                </div>

                <div className="flex flex-col items-center min-w-[80px] p-3 bg-gray-50 rounded-xl">
                  <span className="text-2xl font-bold text-art-purple-600">
                    {post.reply_count}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Replies
                  </span>
                </div>
              </div>
            </div>
          ))}

          {!loading && filteredPosts.length === 0 && (
            <div className="p-20 text-center text-xl text-gray-500">
              No discussions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
