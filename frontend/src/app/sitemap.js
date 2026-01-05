export default async function sitemap() {
  const baseUrl = 'https://your-domain.com';

  // Static pages
  const routes = [
    '',
    '/curriculum',
    '/forum',
    '/diagnostic',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Forum Posts
  let posts = [];
  try {
    const res = await fetch('http://localhost:5000/api/forum/posts', { cache: 'no-store' });
    const data = await res.json();
    if (data.posts) {
        posts = data.posts.map((post) => ({
            url: `${baseUrl}/forum/${post.id}`,
            lastModified: new Date(post.created_at),
            changeFrequency: 'weekly',
            priority: 0.6,
        }));
    }
  } catch (error) {
    console.error('Failed to fetch forum posts for sitemap:', error);
  }

  return [...routes, ...posts];
}
