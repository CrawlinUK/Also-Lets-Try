"use strict";

const CACHE_NAME = "also-lets-try-assets-v1";
const CACHE_PREFIX = "also-lets-try-assets-";
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const CACHED_AT_HEADER = "x-also-cached-at";
const ASSET_PATTERN = /\.(?:png|jpe?g|webp|gif|avif|svg|woff2?|otf|ttf)$/i;

let cleanupPromise = null;

function isCacheableAsset(request) {
  if (!request || request.method !== "GET") return false;
  const url = new URL(request.url);
  return url.origin === self.location.origin && ASSET_PATTERN.test(url.pathname);
}

async function stampResponse(response) {
  const headers = new Headers(response.headers);
  headers.set(CACHED_AT_HEADER, String(Date.now()));
  const body = await response.clone().blob();
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function responseAge(response) {
  const storedAt = Number(response && response.headers.get(CACHED_AT_HEADER));
  return Number.isFinite(storedAt) && storedAt > 0
    ? Date.now() - storedAt
    : Infinity;
}

async function storeNetworkResponse(request, cache) {
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    await cache.put(request, await stampResponse(response));
  }
  return response;
}

async function cleanupExpiredAssets() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  await Promise.all(requests.map(async (request) => {
    const response = await cache.match(request);
    if (!response || responseAge(response) > CACHE_MAX_AGE) {
      await cache.delete(request);
    }
  }));
}

function ensureCleanup() {
  if (!cleanupPromise) {
    cleanupPromise = cleanupExpiredAssets().catch(() => undefined);
  }
  return cleanupPromise;
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        .map((name) => caches.delete(name))
    );
    await cleanupExpiredAssets();
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (!isCacheableAsset(event.request)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);

    event.waitUntil(ensureCleanup());

    if (cached && responseAge(cached) <= CACHE_MAX_AGE) {
      event.waitUntil(
        storeNetworkResponse(event.request, cache).catch(() => undefined)
      );
      return cached;
    }

    if (cached) {
      await cache.delete(event.request);
    }

    return storeNetworkResponse(event.request, cache);
  })());
});
