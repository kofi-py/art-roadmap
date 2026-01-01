import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-art-purple-900 via-art-blue-900 to-art-red-900 text-white py-12 canvas-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Art Roadmap
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Making world-class art education accessible to everyone. 100% free, forever.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/curriculum" className="text-white/70 hover:text-art-yellow-400 transition-colors text-sm">Courses</Link></li>
              <li><Link href="/diagnostic" className="text-white/70 hover:text-art-yellow-400 transition-colors text-sm">Diagnostic</Link></li>
              <li><Link href="/forum" className="text-white/70 hover:text-art-yellow-400 transition-colors text-sm">Forum</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="https://www.khanacademy.org/humanities/art-history" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-art-yellow-400 transition-colors text-sm">Khan Academy</a></li>
              <li><a href="https://smarthistory.org" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-art-yellow-400 transition-colors text-sm">Smarthistory</a></li>
              <li><a href="https://drawabox.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-art-yellow-400 transition-colors text-sm">Drawabox</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <div className="text-white/70 text-sm">📧 hello@artroadmap.org</div>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">🐦</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">📘</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">📸</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/60 text-sm">
              © 2025 Art Roadmap. Made with 🎨 for artists everywhere.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
