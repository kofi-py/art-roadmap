'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cookieUtils, progressAPI } from '../../lib/api';
import { courses } from '../../lib/coursesData';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurriculumPage() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [cookieConsent, setCookieConsent] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    const userInfo = cookieUtils.getUserInfo();
    setUser(userInfo);
    const consent = localStorage.getItem('cookie_consent');
    setCookieConsent(consent);

    if (userInfo) {
      fetchProgress();
    }
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await progressAPI.getProgress();
      if (Array.isArray(data)) {
        setCompletedCourses(data);
      }
    } catch (err) {
      console.error('Failed to load progress', err);
    }
  };

  const toggleCourseCompletion = async (courseId) => {
    if (!user) return;
    
    // Optimistic update
    const isCompleted = completedCourses.includes(courseId);
    const newCompleted = isCompleted 
      ? completedCourses.filter(id => id !== courseId)
      : [...completedCourses, courseId];
    
    setCompletedCourses(newCompleted);

    try {
      await progressAPI.updateProgress(courseId, !isCompleted);
    } catch (err) {
      // Revert on failure
      console.error('Failed to update progress', err);
      setCompletedCourses(completedCourses); 
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const levels = ['All', 'Elementary', 'Middle', 'High', 'College'];
  const progressPercentage = Math.round((completedCourses.length / courses.length) * 100);

  return (
    <div className="min-h-screen canvas-texture py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-rainbow mb-4 drop-shadow-sm">Art Curriculum</h1>
          <p className="text-xl text-gray-600">80 premium free courses curated from across the web</p>
        </motion.div>
        
        {/* Progress Bar for Logged In Users */}
        <AnimatePresence>
          {user && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-12"
            >
              <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                <div className="flex-grow w-full">
                  <div className="flex justify-between mb-2 font-bold">
                    <span className="text-gray-700">Your Progress</span>
                    <span className="text-art-purple-600">{completedCourses.length} / {courses.length} Completed ({progressPercentage}%)</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-rainbow"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                {progressPercentage >= 100 && (
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="text-4xl"
                   >
                     🏆
                   </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {!user && cookieConsent === 'accepted' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="art-card p-6 mb-8 bg-art-yellow-50 border-4 border-art-yellow-400 overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-3xl mb-12"
        >
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
                    ? 'bg-art-purple-600 text-white shadow-glow-rainbow scale-105' 
                    : 'bg-white text-gray-600 hover:bg-purple-50 border-2 border-transparent hover:scale-105'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const isCompleted = completedCourses.includes(course.id);
              return (
              <motion.div 
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`art-card group overflow-hidden flex flex-col h-full transition-all duration-300 ${isCompleted ? 'ring-4 ring-art-green-400 bg-green-50/30' : ''}`}
              >
                <div className={`h-3 bg-gradient-to-r ${
                  course.level === 'Elementary' ? 'from-art-yellow-400 to-art-orange-500' :
                  course.level === 'Middle' ? 'from-art-green-400 to-art-blue-500' :
                  course.level === 'High' ? 'from-art-blue-500 to-art-purple-600' :
                  'from-art-purple-600 to-art-red-600'
                }`} />
                <div className="p-6 flex-grow relative">
                  {user && (
                    <button
                      onClick={() => toggleCourseCompletion(course.id)}
                      className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
                        isCompleted 
                          ? 'bg-art-green-500 text-white shadow-lg scale-110' 
                          : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                      }`}
                      title={isCompleted ? "Mark as complete" : "Mark as incomplete"}
                    >
                      <span className="text-xl">{isCompleted ? '✓' : '○'}</span>
                    </button>
                  )}
                  
                  <div className="flex justify-between items-start mb-4 pr-12">
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
                  <h3 className={`text-2xl font-bold mb-2 transition-colors ${isCompleted ? 'text-art-green-700' : 'text-gray-900 group-hover:text-art-purple-600'}`}>
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-art-purple-600 hover:text-white transition-all border-2 border-gray-100 hover:border-transparent group-hover:shadow-glow-rainbow"
                  >
                    {isCompleted ? 'Review Course' : 'Start Course'} <span>🚀</span>
                  </a>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </motion.div>

        {filteredCourses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">🎨</span>
            <h3 className="text-2xl font-bold text-gray-900">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedLevel('All');}}
              className="mt-6 text-art-purple-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
