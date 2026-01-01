'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { id: 'general', name: 'General Discussion', emoji: '💬', color: 'bg-art-blue-50 text-art-blue-600 border-art-blue-100' },
  { id: 'showcase', name: 'Show & Tell', emoji: '🎨', color: 'bg-art-purple-50 text-art-purple-600 border-art-purple-100' },
  { id: 'advice', name: 'Art Advice', emoji: '💡', color: 'bg-art-yellow-50 text-art-yellow-600 border-art-yellow-100' },
  { id: 'homework', name: 'Critique Wanted', emoji: '❓', color: 'bg-art-red-50 text-art-red-600 border-art-red-100' },
  { id: 'resources', name: 'Resources', emoji: '📚', color: 'bg-art-green-50 text-art-green-600 border-art-green-100' },
];

const initialPosts = [
  {
    id: 1,
    title: "Just finished my first oil painting!",
    author: "ArtLover22",
    date: "2 hours ago",
    category: "showcase",
    replies: 12,
    content: "I've been following the Bob Ross style courses and finally completed one. Feedback welcome!",
    avatar: "A"
  },
  {
    id: 2,
    title: "Which drawing tablet is best for beginners?",
    author: "SketchyPath",
    date: "5 hours ago",
    category: "advice",
    replies: 8,
    avatar: "S"
  },
  {
    id: 3,
    title: "Study group for Art History (Renaissance)?",
    author: "MuseumAddict",
    date: "1 day ago",
    category: "general",
    replies: 5,
    avatar: "M"
  },
  {
    id: 4,
    title: "Procreate brushes repository",
    author: "DigitalWizard",
    date: "2 days ago",
    category: "resources",
    replies: 24,
    avatar: "D"
  },
  {
    id: 5,
    title: "Critique on my character design",
    author: "KnightDrow",
    date: "3 days ago",
    category: "homework",
    replies: 2,
    avatar: "K"
  },
];

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'post'
  const [activePost, setActivePost] = useState(null);

  const filteredPosts = initialPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePostClick = (post) => {
    setActivePost(post);
    setView('post');
  };

  if (view === 'post' && activePost) {
    return (
      <div className="min-h-screen canvas-texture py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setView('list')}
            className="mb-8 flex items-center gap-2 text-art-purple-600 font-bold hover:underline"
          >
            ← back to discussions
          </button>

          <article className="glass-card p-10 rounded-3xl mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-rainbow rounded-full flex items-center justify-center text-white font-bold text-xl">
                {activePost.avatar}
              </div>
              <div>
                <div className="font-bold text-gray-900">{activePost.author}</div>
                <div className="text-sm text-gray-500">{activePost.date}</div>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase ${
                categories.find(c => c.id === activePost.category)?.color || 'bg-gray-100'
              }`}>
                {activePost.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{activePost.title}</h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {activePost.content || "Placeholder content for this forum post. In a real application, this would be loaded from the database and support markdown formatting."}
            </p>
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Replies ({activePost.replies})</h3>
              {/* Mock Replies */}
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900">MentorJoe</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <p className="text-gray-700">Excellent work! I really like how you handled the values in the clouds.</p>
                </div>
              </div>
            </div>
          </article>

          <div className="glass-card p-8 rounded-3xl">
            <h3 className="font-bold mb-4">Leave a Reply</h3>
            <textarea 
              className="w-full p-4 bg-white/50 border-2 border-gray-200 rounded-2xl focus:border-art-purple-500 outline-none transition-all mb-4"
              placeholder="Write your thoughts..."
              rows="4"
            ></textarea>
            <button className="btn-primary w-full md:w-auto px-8">Post Reply</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen canvas-texture py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-6xl font-bold text-rainbow mb-2">Community Forum</h1>
            <p className="text-xl text-gray-600">Connect, share, and grow with other artists</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-lg px-8">
            <span className="text-2xl">+</span> New Discussion
          </button>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`p-4 rounded-2xl border-2 transition-all text-center ${
              selectedCategory === 'all' 
              ? 'bg-art-purple-600 text-white border-transparent shadow-glow-rainbow' 
              : 'bg-white border-gray-100 text-gray-600 hover:border-art-purple-200 shadow-sm'
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
                : 'bg-white border-gray-100 text-gray-600 hover:border-art-purple-200 shadow-sm'
              }`}
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="font-bold">{cat.name}</div>
            </button>
          ))}
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search discussions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-art-purple-500 outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredPosts.map(post => (
              <div 
                key={post.id} 
                onClick={() => handlePostClick(post)}
                className="p-8 hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex w-14 h-14 bg-gradient-cool rounded-2xl items-center justify-center text-white font-bold text-2xl group-hover:rotate-6 transition-transform">
                    {post.avatar}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        categories.find(c => c.id === post.category)?.color || 'bg-gray-100'
                      }`}>
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-art-purple-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 font-medium mt-1">
                      Posted by <span className="text-art-purple-500">{post.author}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-[80px] p-3 bg-gray-50 rounded-xl group-hover:bg-art-purple-50 transition-colors">
                    <span className="text-2xl font-bold text-art-purple-600">{post.replies}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Replies</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-gray-500 text-xl font-medium">No discussions found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
