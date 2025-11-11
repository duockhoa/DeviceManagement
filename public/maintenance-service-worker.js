// Cấu hình cache cho module bảo trì
const CACHE_NAME = 'maintenance-cache-v1';
const API_CACHE_NAME = 'maintenance-api-cache-v1';

const STATIC_RESOURCES = [
    '/static/js/maintenance.chunk.js',
    '/static/css/maintenance.chunk.css',
    '/static/media/maintenance-icons.svg'
];

const API_ROUTES = [
    '/api/maintenance',
    '/api/maintenance/stats',
    '/api/maintenance/upcoming'
];

// Cài đặt service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // Cache static resources
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(STATIC_RESOURCES);
            }),
            // Cache API responses
            caches.open(API_CACHE_NAME)
        ])
    );
});

// Chiến lược cache: Cache first, then network
self.addEventListener('fetch', (event) => {
    const isApiRequest = API_ROUTES.some(route => 
        event.request.url.includes(route)
    );

    if (isApiRequest) {
        // Chiến lược cho API requests: Network first, then cache
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Clone response để cache
                    const responseToCache = response.clone();
                    caches.open(API_CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                })
                .catch(() => {
                    // Nếu network fail, dùng cache
                    return caches.match(event.request);
                })
        );
    } else {
        // Chiến lược cho static resources: Cache first, then network
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});

// Xóa cache cũ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith('maintenance-'))
                        .filter(name => name !== CACHE_NAME && name !== API_CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
        ])
    );
});

// Background sync cho offline support
self.addEventListener('sync', (event) => {
    if (event.tag === 'maintenance-sync') {
        event.waitUntil(
            // Sync pending changes
            syncPendingChanges()
        );
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        if (data.type === 'maintenance-alert') {
            event.waitUntil(
                self.registration.showNotification('Thông báo bảo trì', {
                    body: data.message,
                    icon: '/maintenance-icon.png',
                    badge: '/badge-icon.png',
                    data: data
                })
            );
        }
    }
});

// Helper function để sync pending changes
async function syncPendingChanges() {
    const db = await openDB('maintenance-db', 1);
    const pendingChanges = await db.getAll('pending-changes');
    
    for (const change of pendingChanges) {
        try {
            await fetch(change.url, {
                method: change.method,
                headers: change.headers,
                body: change.body
            });
            await db.delete('pending-changes', change.id);
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }
}