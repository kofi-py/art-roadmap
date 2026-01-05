'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/forum/posts/${id}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data.post);
        setReplies(data.replies);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        router.push('/forum'); // Redirect if not found
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostDetails();
  }, [id, router]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/forum/posts/${id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to post reply');

      const data = await res.json();
      
      // Update replies list
      setReplies([...replies, data.reply]);
      setReplyContent('');
    } catch (err) {
      console.error('Reply error:', err);
      alert('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen canvas-texture py-20 flex justify-center text-xl text-gray-500">
        Loading discussion...
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen canvas-texture py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-art-purple-600 transition-colors font-bold"
        >
          ← Back to Forum
        </button>

        {/* MAIN POST */}
        <div className="glass-card p-10 rounded-3xl mb-8 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-art-purple-50 text-art-purple-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {post.category_name}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-cool rounded-full flex items-center justify-center text-white font-bold">
              {post.author[0].toUpperCase()}
            </div>
            <span className="font-bold text-gray-700">
              {post.author}
            </span>
          </div>

          <div className="prose prose-lg text-gray-600 max-w-none">
            {post.content.split('\n').map((line, i) => (
              <p key={i} className="mb-4 last:mb-0">{line}</p>
            ))}
          </div>
        </div>

        {/* REPLIES SECTION */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span>💬</span> 
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h3>

          <div className="space-y-6">
            {replies.map(reply => (
              <div key={reply.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                      {reply.author[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">{reply.author}</span>
                        <span className="text-xs text-gray-400">• {new Date(reply.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{reply.content}</p>
                    </div>
                 </div>
              </div>
            ))}

            {replies.length === 0 && (
              <div className="text-center py-10 text-gray-400 italic bg-gray-50 rounded-2xl">
                No replies yet. Be the first to join the conversation!
              </div>
            )}
          </div>
        </div>

        {/* POST REPLY FORM */}
        {user ? (
          <div className="glass-card p-8 rounded-3xl border-2 border-art-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Reply</h3>
            <form onSubmit={handleReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-art-purple-500 focus:ring-4 focus:ring-art-purple-50 outline-none transition-all resize-none mb-4 text-lg"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-art-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-art-purple-700 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-art-blue-50 p-8 rounded-3xl text-center border border-art-blue-100">
            <p className="text-art-blue-800 font-bold text-lg mb-4">
              Log in or sign up to join the discussion!
            </p>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-3 bg-white text-art-blue-600 font-bold rounded-xl shadow-sm border border-art-blue-100 hover:shadow-md transition-all"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
