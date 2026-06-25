const CACHE_NAME = 'liyue-contract-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安装阶段：缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 拦截请求：对 Supabase API 请求直接走网络，其他请求优先缓存
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // 如果是 Supabase API 请求，跳过缓存，直接 fetch
  if (url.hostname === 'bxhjmzvkmiipnjkdyprx.supabase.co') {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});