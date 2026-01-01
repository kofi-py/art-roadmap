'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import ColorWheel3D from '../components/ColorWheel3D';
import ThreeScene from '../components/ThreeScene';

export default function HomePage() {
  return (
    <div className="canvas-texture relative">
      <ThreeScene />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center page-transition relative z-10">
          <div className="inline-block mb-8">
            <div className="glass-card flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl border-white/40">
              <span className="text-3xl animate-bounce">🎨</span>
              <span className="text-sm font-black text-gray-900 uppercase tracking-widest">
                80 Free Courses • K-12 to College
              </span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
            <span className="text-rainbow text-3d block mb-2">MASTER ART</span>
            <span className="text-gray-900 text-3d-white">From First Sketch to Masterpiece</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            A vibrant journey through drawing, painting, sculpture, and digital art—
            curated from world-class artists and museums.
          </p>

          {/* 3D Color Wheel / Object */}
          <div className="flex justify-center mb-16 perspective-1000">
            <Suspense fallback={<div className="w-64 h-64 bg-white/20 backdrop-blur-md rounded-full animate-pulse" />}>
              <div className="transform hover:scale-110 transition-transform duration-500">
                <ColorWheel3D />
              </div>
            </Suspense>
          </div>

          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <Link href="/curriculum" className="btn-primary group text-lg px-10 py-5">
              <span>Explore Courses</span>
              <span className="inline-block ml-3 group-hover:translate-x-2 transition-transform">→</span>
            </Link>
            <Link href="/diagnostic" className="btn-secondary text-lg px-10 py-5 glass-card border-none hover:bg-white/90">
              Find Your Level
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-art-red-500 rounded-full animate-pulse"></span>
            <span>100% Free • Browse as Guest • Sign Up to Save Progress</span>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 px-4 relative z-10">
          {[
            { number: '80+', label: 'Free Courses', icon: '🎨', color: 'from-art-red-400 to-art-red-600' },
            { number: '17', label: 'Learning Levels', icon: '📊', color: 'from-art-blue-400 to-art-blue-600' },
            { number: '∞', label: 'Creativity', icon: '✨', color: 'from-art-yellow-400 to-art-yellow-600' },
            { number: '100%', label: 'Free Forever', icon: '🎁', color: 'from-art-purple-400 to-art-purple-600' }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="glass-card p-8 text-center transform hover:scale-110 transition-all duration-500 rounded-3xl group"
            >
              <div className={`text-4xl mb-4 inline-block p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:rotate-12 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-black text-rainbow mb-2 text-3d">{stat.number}</div>
              <div className="text-xs uppercase tracking-widest text-gray-700 font-black">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Guest vs Auth */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 text-3d-white">
              Choose Your Experience
            </h2>
            <p className="text-xl text-gray-700 font-medium">Browse freely or track your artistic journey with 3D persistence.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Guest Mode */}
            <div className="glass-card p-12 rounded-3xl transform hover:-rotate-1 transition-transform">
              <div className="text-6xl mb-6">🌍</div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">Browse as Guest</h3>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-art-green-500 font-bold">✓</span>
                  <span>Access all 80 courses instantly</span>
                </li>
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-art-green-500 font-bold">✓</span>
                  <span>View community forum</span>
                </li>
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-red-400 font-bold">✗</span>
                  <span className="text-gray-500 italic">Progress not saved</span>
                </li>
              </ul>
              <Link href="/curriculum" className="btn-secondary w-full text-center block py-5 bg-white/50 border-white/40">
                Start Browsing
              </Link>
            </div>

            {/* Auth Mode */}
            <div className="glass-card p-12 rounded-3xl border-art-purple-400/50 shadow-art-purple-200/50 transform hover:rotate-1 transition-transform relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[10px] bg-art-purple-600 text-white px-5 py-2 rounded-bl-2xl font-black tracking-widest">
                RECOMMENDED
              </div>
              <div className="text-6xl mb-6 animate-pulse">🎯</div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">Create Account</h3>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-art-purple-500 font-bold">✓</span>
                  <span className="font-bold">Progress saved to database</span>
                </li>
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-art-purple-500 font-bold">✓</span>
                  <span>Track completed courses</span>
                </li>
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-art-purple-500 font-bold">✓</span>
                  <span>Create forum posts</span>
                </li>
              </ul>
              <Link href="/signup" className="btn-primary w-full text-center block py-5 shadow-2xl">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Art Subjects */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900 text-3d-white uppercase">
              Explore Every Art Form
            </h2>
            <p className="text-xl text-gray-700 font-bold uppercase tracking-widest">From traditional to digital masterpieces</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '✏️', title: 'Drawing', courses: '20 courses', color: 'from-pink-500/20 to-rose-500/20' },
              { icon: '🖌️', title: 'Painting', courses: '18 courses', color: 'from-orange-500/20 to-amber-500/20' },
              { icon: '🗿', title: 'Sculpture', courses: '15 courses', color: 'from-emerald-500/20 to-teal-500/20' },
              { icon: '💻', title: 'Digital Art', courses: '27 courses', color: 'from-blue-500/20 to-cyan-500/20' }
            ].map((subject, idx) => (
              <div key={idx} className={`glass-card rounded-3xl p-8 hover:scale-105 transition-all cursor-pointer group relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500 inline-block">{subject.icon}</div>
                  <h3 className="text-2xl font-black mb-2 text-gray-900 uppercase">{subject.title}</h3>
                  <div className="text-gray-600 font-bold text-xs tracking-widest uppercase">{subject.courses}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-4 relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center glass-card p-16 rounded-[4rem] relative overflow-hidden border-art-purple-200/50">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-rainbow" />
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 text-3d-white uppercase tracking-tighter">
            Ready to Create?
          </h2>
          <p className="text-2xl text-gray-700 mb-12 font-medium">
            Join thousands of artists discovering their unique voice in 3D space.
          </p>
          <div className="flex flex-wrap gap-8 justify-center">
            <Link href="/curriculum" className="btn-primary text-xl px-12 py-6 shadow-glow-rainbow">
              Browse All Courses
            </Link>
            <Link href="/signup" className="btn-secondary text-xl px-12 py-6 glass-card border-none hover:bg-white/90">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
