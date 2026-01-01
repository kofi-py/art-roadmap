'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { diagnosticQuestions } from '../../lib/diagnosticData';

export default function DiagnosticPage() {
  const [step, setStep] = useState('intro'); // 'intro', 'test', 'results'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleStart = () => {
    setStep('test');
    setCurrentIdx(0);
    setScore(0);
    setAnswers([]);
  };

  const handleAnswer = (optionId) => {
    const isCorrect = optionId === diagnosticQuestions[currentIdx].correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    
    const newAnswers = [...answers, { qId: diagnosticQuestions[currentIdx].id, correct: isCorrect }];
    setAnswers(newAnswers);

    if (currentIdx < diagnosticQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStep('results');
    }
  };

  const getRecommendation = () => {
    const percentage = (score / diagnosticQuestions.length) * 100;
    if (percentage <= 30) return { level: 'Elementary', text: 'Great start! You have a solid foundation. We recommend starting with our Elementary courses to master the basics.' };
    if (percentage <= 60) return { level: 'Middle', text: 'You know your stuff! You are ready for our Middle School curriculum to deepen your technical skills.' };
    if (percentage <= 85) return { level: 'High', text: 'Impressive! You have advanced knowledge. Dive into our High School courses for professional-level techniques.' };
    return { level: 'College', text: 'Expert level! You are ready for our College & Professional curriculum to refine your mastery.' };
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen canvas-texture flex items-center justify-center p-4">
        <div className="max-w-3xl w-full glass-card p-12 rounded-3xl text-center animate-fadeInUp">
          <div className="text-6xl mb-6">🎨</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-proxima">Art Level Diagnostic</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Take our 10-minute adaptive test to find the perfect starting point for your artistic journey. 
            We'll evaluate your knowledge in drawing, color theory, and art history.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="p-4 bg-art-red-50 rounded-2xl border-2 border-art-red-100">
              <div className="font-bold text-art-red-600">Drawing</div>
            </div>
            <div className="p-4 bg-art-blue-50 rounded-2xl border-2 border-art-blue-100">
              <div className="font-bold text-art-blue-600">Color</div>
            </div>
            <div className="p-4 bg-art-yellow-50 rounded-2xl border-2 border-art-yellow-100">
              <div className="font-bold text-art-yellow-600">History</div>
            </div>
            <div className="p-4 bg-art-purple-50 rounded-2xl border-2 border-art-purple-100">
              <div className="font-bold text-art-purple-600">Digital</div>
            </div>
          </div>
          <button 
            onClick={handleStart}
            className="btn-primary text-xl px-12 py-4"
          >
            Start Diagnostic Test
          </button>
        </div>
      </div>
    );
  }

  if (step === 'test') {
    const q = diagnosticQuestions[currentIdx];
    const progress = ((currentIdx + 1) / diagnosticQuestions.length) * 100;

    return (
      <div className="min-h-screen canvas-texture py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-art-purple-600 uppercase tracking-wider">
                {q.subject} • {q.level}
              </span>
              <span className="text-sm font-medium text-gray-500">
                Question {currentIdx + 1} of {diagnosticQuestions.length}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-rainbow transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="glass-card p-10 rounded-3xl shadow-glow-rainbow/10 animate-slideUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 leading-snug">
              {q.question}
            </h2>
            
            <div className="grid gap-4">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  className="group flex items-center p-6 bg-white hover:bg-art-purple-50 border-2 border-gray-100 hover:border-art-purple-300 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="w-10 h-10 flex items-center justify-center bg-gray-100 group-hover:bg-art-purple-600 group-hover:text-white rounded-lg font-bold mr-4 transition-colors">
                    {opt.id}
                  </span>
                  <span className="text-lg font-medium text-gray-700 group-hover:text-art-purple-900 transition-colors">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const rec = getRecommendation();
    return (
      <div className="min-h-screen canvas-texture flex items-center justify-center p-4">
        <div className="max-w-3xl w-full glass-card p-12 rounded-3xl text-center animate-fadeInUp">
          <div className="text-7xl mb-6">🏆</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Diagnostic Complete!</h1>
          <div className="text-2xl font-bold text-rainbow mb-8">
            You scored {score}/{diagnosticQuestions.length}
          </div>
          
          <div className="p-8 bg-white border-2 border-art-purple-100 rounded-3xl mb-10 shadow-lg">
            <div className="text-sm font-bold text-art-purple-600 uppercase mb-2">Recommended Starting Level</div>
            <div className={`text-4xl font-bold mb-4 ${
              rec.level === 'Elementary' ? 'text-art-orange-500' :
              rec.level === 'Middle' ? 'text-art-blue-500' :
              rec.level === 'High' ? 'text-art-purple-500' :
              'text-art-red-600'
            }`}>
              {rec.level} School
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {rec.text}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/curriculum" 
              className="btn-primary text-xl px-12 py-4 flex items-center justify-center gap-2"
            >
              Go to Curriculum 🚀
            </Link>
            <button 
              onClick={handleStart}
              className="px-12 py-4 bg-white text-gray-600 font-bold rounded-2xl border-2 border-gray-200 hover:bg-gray-50 transition-all"
            >
              Retake Diagnostic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
