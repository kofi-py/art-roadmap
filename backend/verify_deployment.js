async function verify() {
  const baseURL = 'http://localhost:5000';
  console.log('🔍 Verifying Backend at', baseURL);

  try {
    // 1. Health
    const health = await fetch(`${baseURL}/api/health`).then(res => res.json());
    console.log('✅ /api/health:', 'OK', health);

    // 2. Categories (Forum)
    const cats = await fetch(`${baseURL}/api/forum/categories`).then(res => res.json());
    console.log('✅ /api/forum/categories:', 'OK', `Found ${cats.length} categories`);

    // 3. Posts (Forum)
    const posts = await fetch(`${baseURL}/api/forum/posts`).then(res => res.json());
    console.log('✅ /api/forum/posts:', 'OK', `Found ${posts.posts?.length} posts`);

    console.log('🎉 Backend verification PASSED');
  } catch (err) {
    console.error('❌ Verification FAILED:', err.message);
  }
}

verify();
