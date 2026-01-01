'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cookieUtils } from '../../lib/api';
import { courses } from '../../lib/coursesData';

export default function CurriculumPage() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [cookieConsent, setCookieConsent] = useState(null);

  useEffect(() => {
    const userInfo = cookieUtils.getUserInfo();
    setUser(userInfo);
    const consent = localStorage.getItem('cookie_consent');
    setCookieConsent(consent);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const levels = ['All', 'Elementary', 'Middle', 'High', 'College'];

  return (
    <div className="min-h-screen canvas-texture py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-rainbow mb-4 drop-shadow-sm">Art Curriculum</h1>
          <p className="text-xl text-gray-600">80 premium free courses curated from across the web</p>
        </div>
        
        {!user && cookieConsent === 'accepted' && (
          <div className="art-card p-6 mb-8 bg-art-yellow-50 border-4 border-art-yellow-400">
            <div className="flex items-center gap-4">
              <span className="text-4xl">💡</span>
              <div>
                <div className="font-bold text-gray-900 mb-1">
                  Want to save your progress?
                </div>
                <p className="text-gray-700 mb-3">
                  Create an account to track your completed courses and get personalized recommendations.
                </p>
                <Link href="/signup" className="btn-primary inline-block">
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card p-8 rounded-3xl mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow flex gap-4 w-full">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by course title, category, or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-white/50 border-2 border-art-purple-200 rounded-2xl focus:border-art-purple-500 focus:ring-4 focus:ring-art-purple-100 outline-none transition-all pr-12 text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
              </div>
              <button className="btn-primary px-8 whitespace-nowrap hidden md:block">
                Search
              </button>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    selectedLevel === level 
                    ? 'bg-art-purple-600 text-white shadow-glow-rainbow' 
                    : 'bg-white text-gray-600 hover:bg-purple-50 border-2 border-transparent'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div key={course.id} className="art-card group overflow-hidden flex flex-col">
              <div className={`h-3 bg-gradient-to-r ${
                course.level === 'Elementary' ? 'from-art-yellow-400 to-art-orange-500' :
                course.level === 'Middle' ? 'from-art-green-400 to-art-blue-500' :
                course.level === 'High' ? 'from-art-blue-500 to-art-purple-600' :
                'from-art-purple-600 to-art-red-600'
              }`} />
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    course.level === 'Elementary' ? 'bg-art-orange-500' :
                    course.level === 'Middle' ? 'bg-art-blue-500' :
                    course.level === 'High' ? 'bg-art-purple-500' :
                    'bg-art-red-600'
                  }`}>
                    {course.level}
                  </span>
                  <span className="text-sm font-medium text-gray-500">{course.duration}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-art-purple-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm font-bold text-art-purple-500 mb-3">{course.provider}</p>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {course.description}
                </p>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <a 
                  href={course.link} 
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-art-purple-600 hover:text-white transition-all border-2 border-gray-100 hover:border-transparent group-hover:shadow-glow-rainbow"
                >
                  Start Course <span>🚀</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🎨</span>
            <h3 className="text-2xl font-bold text-gray-900">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedLevel('All');}}
              className="mt-6 text-art-purple-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
