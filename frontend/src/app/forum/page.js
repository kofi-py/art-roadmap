'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForumPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline reply state
  const [replyContent, setReplyContent] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  // 🔌 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch('http://localhost:5000/api/forum/posts', { credentials: 'include' }),
          fetch('http://localhost:5000/api/forum/categories')
        ]);

        const postsData = await postsRes.json();
        const catsData = await catsRes.json();

        setPosts(postsData.posts || []);
        if (Array.isArray(catsData)) {
          setCategories(catsData);
        }
      } catch (err) {
        console.error('Failed to fetch forum data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInlineReply = async (postId) => {
    if (!replyContent[postId]?.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/forum/posts/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent[postId] }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to reply');

      // Optimistic update or refetch
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return { ...p, reply_count: parseInt(p.reply_count) + 1 };
        }
        return p;
      });
      setPosts(updatedPosts);
      setReplyContent({ ...replyContent, [postId]: '' });
      setReplyingTo(null);
    } catch (err) {
      console.error('Reply error:', err);
      alert('Failed to post reply. Please try again.');
    }
  };

  // Rainbow colors for categories
  const getCategoryColor = (index, isSelected) => {
    const colors = [
      'from-red-400 to-orange-400',
      'from-orange-400 to-yellow-400',
      'from-yellow-400 to-green-400',
      'from-green-400 to-blue-400',
      'from-blue-400 to-purple-400',
      'from-purple-400 to-pink-400',
      'from-pink-400 to-rose-400'
    ];
    const colorClass = colors[index % colors.length];
    
    // Base classes for all buttons (colorful)
    let classes = `bg-gradient-to-br ${colorClass} text-white transition-all duration-300`;
    
    if (isSelected) {
      // Selected: larger, shadow, full opacity
      return `${classes} shadow-lg scale-110 ring-4 ring-offset-2 ring-art-purple-100`;
    }
    
    // Not selected: slightly smaller, lower opacity/dimmer
    return `${classes} opacity-60 hover:opacity-100 hover:scale-105 hover:shadow-md`;
  };

  // 🔍 FILTER POSTS
  const filteredPosts = posts.filter(post => {
    const matchesCategory =
      selectedCategory === 'all' ||
      post.category_id === parseInt(selectedCategory);

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen canvas-texture py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <h1 className="text-6xl font-bold text-rainbow mb-2">Community Forum</h1>
            <p className="text-xl text-gray-600">Connect, share, and grow with other artists</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/forum/new')}
            className="btn-primary flex items-center gap-2 text-lg px-8"
          >
            <span className="text-2xl">+</span> New Discussion
          </motion.button>
        </motion.div>

        {/* CATEGORIES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-4 rounded-2xl border-2 transition-all text-center ${
              selectedCategory === 'all'
                ? 'bg-gradient-rainbow text-white border-transparent shadow-glow-rainbow'
                : 'bg-white border-gray-100 text-gray-600'
            }`}
          >
            <div className="text-2xl mb-1">🌍</div>
            <div className="font-bold">All Topics</div>
          </button>

          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-2xl border-2 transition-all text-center ${getCategoryColor(idx, selectedCategory === cat.id)}`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="font-bold">{cat.name}</div>
            </button>
          ))}
        </motion.div>

        {/* POSTS */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl overflow-hidden"
        >
          
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
          <AnimatePresence>
            {!loading && filteredPosts.map((post, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={post.id} 
                className="border-b border-gray-100 last:border-0"
              >
                <div 
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

                {/* INLINE REPLY */}
                <div className="px-8 pb-6 pl-[88px]">
                  <AnimatePresence>
                    {replyingTo === post.id ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyContent[post.id] || ''}
                          onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                          className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-art-purple-500 outline-none"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleInlineReply(post.id);
                          }}
                        />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInlineReply(post.id);
                          }}
                          className="px-4 py-2 bg-art-purple-600 text-white rounded-xl font-bold text-sm"
                        >
                          Send
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) {
                            alert('Log in or sign up to join the discussion!');
                            return;
                          }
                          setReplyingTo(post.id);
                        }}
                        className="text-sm font-bold text-gray-400 hover:text-art-purple-600 transition-colors flex items-center gap-1"
                      >
                        <span>↩️</span> Reply immediately
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* EMPTY STATE */}
          {!loading && filteredPosts.length === 0 && (
            <div className="p-20 text-center text-xl text-gray-500">
              No discussions found.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
