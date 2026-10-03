const CACHE_NAME = "geep-documentacao-v1.0";

const APP_SHELL = [
  "./",
  "./index.html",

  // CSS
  "./assets/css/reset.css",
  "./assets/css/variables.css",
  "./assets/css/global.css",
  "./assets/css/layout.css",
  "./assets/css/header.css",
  "./assets/css/sidebar.css",
  "./assets/css/content.css",

  // JavaScript
  "./assets/js/app.js",

  // PWA
  "./manifest.json",

  // Ícones
  "./assets/img/icons/icone_192.png",
  "./assets/img/icons/icone_512.png"
];

/**
 * Instalação
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

/**
 * Ativação
 *
 * Remove caches de versões antigas.
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Estratégia de carregamento:
 *
 * 1. Tenta buscar na rede.
 * 2. Salva uma cópia no cache.
 * 3. Se estiver offline, utiliza o cache.
 */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});