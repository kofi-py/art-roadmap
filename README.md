# 🎨 Art Roadmap - Complete Learning Platform with Three.js

A vibrant, colorful art education platform with Three.js 3D elements, username/password authentication, cookie consent, Express.js, and PostgreSQL.

## 🌈 Features

- **80 Free Art Courses** from kindergarten through college
- **Three.js 3D Elements** - Rotating color wheels, floating brushes, paint splatters
- **Username/Password Auth** - Traditional signup/login with bcrypt
- **Cookie Consent Banner** - Users can accept/decline cookies
- **Guest Mode** - Browse all courses without account (no progress saved)
- **Progress Tracking** - Only for authenticated users
- **Forum with Database** - Ask questions, share art
- **Vibrant Colorful Design** - Rainbow gradients, paint splatter effects
- **HTTP-Only Cookies** - Secure session management

## 🎨 Color Palette (Primary Colors Theme)

- **Art Red** (#F43F5E) - Passion, energy
- **Art Blue** (#3B82F6) - Calm, depth
- **Art Yellow** (#EAB308) - Joy, creativity
- **Art Green** (#22C55E) - Growth, nature
- **Art Purple** (#A855F7) - Imagination
- **Art Orange** (#F97316) - Warmth, enthusiasm
- **Rainbow Gradients** - Throughout the site!

## 🔤 Fonts

- **Proxima Nova** - Headings and display text
- **Inter** - Body text and UI elements

## 📁 Project Structure

```
art-roadmap/
├── backend/              # Express.js + PostgreSQL + bcrypt
│   ├── server.js        # Main API with password auth
│   ├── schema.sql       # Database schema
│   ├── package.json
│   └── .env.example
├── frontend/            # Next.js 14 + Three.js (JavaScript)
│   ├── src/
│   │   ├── app/        # Pages
│   │   ├── components/ # React + Three.js components
│   │   ├── lib/        # Utilities
│   │   └── data/       # 80 courses data
│   ├── tailwind.config.js  # Colorful art theme
│   └── package.json    # Includes Three.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Backend Setup

```bash
# Create database
createdb art_roadmap

# Navigate to backend
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL password

# Initialize database
npm run init-db

# Start server
npm run dev
```

Backend runs on **http://localhost:5000**

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start Next.js
npm run dev
```

Frontend runs on **http://localhost:3000**

## 🎯 How It Works

### Cookie Consent
On first visit, users see a cookie consent banner:
- **Accept Cookies**: Allows session cookies, progress tracking
- **Decline Cookies**: Can still browse, but no cookies set, no progress saved

### Guest Users (Not Logged In or Cookies Declined)
✅ Can view all 80 courses
✅ Can browse forum posts
✅ Can take diagnostic test
❌ **Cannot save progress**
❌ Cannot create forum posts
❌ Cannot mark courses complete

### Authenticated Users (Signed Up & Accepted Cookies)
✅ Everything guests can do
✅ **Progress saved to database**
✅ Create forum posts and replies
✅ Mark courses as complete
✅ Track learning journey

## 🔐 Authentication Flow

**Signup:**
1. User fills form: First Name, Last Name, Email, Username, Password
2. Password hashed with bcrypt (10 salt rounds)
3. User created in database
4. Session cookie set (HTTP-only)
5. User cookie set (readable by frontend)
6. Redirected to homepage (logged in)

**Login:**
1. User enters email/username + password
2. bcrypt compares password with hash
3. If match, session cookie set
4. User cookie set
5. Redirected to homepage (logged in)

## 🗄️ Database Tables

- `users` - User accounts (password hash with bcrypt)
- `forum_posts` - Forum discussions
- `forum_replies` - Replies to posts
- `categories` - Forum categories (drawing help, art history, etc.)
- `user_progress` - Course completion (auth only)
- `helpful_marks` - Helpful reply votes

## 🎨 Art Courses Included

**K-2:** Drawing basics, colors, shapes (8 courses)
**3-5:** Basic techniques, famous artists (12 courses)
**6-8:** Art history, advanced drawing (15 courses)
**9-12:** Painting, sculpture, digital art (20 courses)
**College:** Art theory, advanced techniques, art history (25 courses)

**Free Resources Used:**
- Khan Academy Art History
- Smarthistory
- The Met (Metropolitan Museum)
- National Gallery of Art
- Drawabox (drawing fundamentals)
- Ctrl+Paint (digital art)
- Proko (anatomy for artists)
- YouTube educators
- Coursera/edX (audit mode)

## 🎭 Three.js 3D Elements

**Homepage:**
- 3D rotating color wheel (primary/secondary colors)
- Floating 3D paint brushes
- Animated paint splatters (particle system)
- 3D palette with realistic lighting

**Curriculum Page:**
- 3D art tools floating in space
- Interactive 3D canvas
- Rotating 3D shapes

**Login/Signup:**
- Animated 3D paint drops
- Floating color spheres

## 🔧 API Endpoints

**Auth:**
- `POST /auth/signup` - Create account (first name, last name, email, username, password)
- `POST /auth/login` - Login with email/username + password
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

**Forum:**
- `GET /api/forum/posts` - Get posts (guests OK)
- `GET /api/forum/posts/:id` - Get single post (guests OK)
- `POST /api/forum/posts` - Create post (auth required)
- `POST /api/forum/posts/:id/replies` - Create reply (auth required)

**Progress:**
- `GET /api/progress` - Get user progress (auth required)
- `POST /api/progress` - Update progress (auth required)

## 🎨 Frontend Pages

1. **Homepage** - Three.js color wheel, vibrant hero, stats, how it works
2. **Signup** - Multi-field form with validation
3. **Login** - Email/username + password
4. **Curriculum** - All 80 courses with search, progress for auth users
5. **Forum** - Community discussions
6. **Cookie Consent Banner** - Accept/decline cookies

## 🍪 Cookie Consent Implementation

**Banner appears on first visit:**
```javascript
// Shows cookie banner
<CookieConsent 
  onAccept={() => enableCookies()}
  onDecline={() => disableCookies()}
/>
```

**If user accepts:**
- Session cookies enabled
- Progress saved to database
- User can create forum posts

**If user declines:**
- No cookies set
- Can still browse all content
- Progress not saved
- Cannot create forum posts

## 💡 Development Tips

**Testing Cookie Consent:**
- Clear localStorage: `localStorage.clear()`
- Refresh page - banner should reappear

**Password Requirements:**
- Minimum 8 characters
- Hashed with bcrypt (10 salt rounds)
- Stored as `password_hash` in database

**Three.js Performance:**
- Models optimized for web
- Low poly count for smooth performance
- Lazy loading for 3D components

## 🚀 Production Deployment

**Backend (Heroku/Railway):**
1. Set environment variables (DB, session secret)
2. Use production database URL
3. Set `NODE_ENV=production`

**Frontend (Vercel):**
1. Set `NEXT_PUBLIC_API_URL` to production backend
2. Deploy via Vercel CLI or GitHub integration

## 🔒 Security Features

✅ HTTP-only session cookies (XSS protection)
✅ SameSite cookies (CSRF protection)
✅ bcrypt password hashing (10 salt rounds)
✅ SQL injection prevention (parameterized queries)
✅ CORS configured for specific origins
✅ Password minimum length (8 characters)
✅ Cookie consent banner

## 📚 Learn More

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Open Pull Request

## 📄 License

MIT License

---

**Made with 🎨 for artists everywhere**
