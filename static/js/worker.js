const CACHE_NAME = 'hmw-cache-v3';
const CACHED_URLS = [
    // HTML
    "index.html",
    // Stylesheets
    "css/base.css",
    "css/normalize.css",
    // Javascript
    "js/main.js",
    // Frameworks
    "node_modules/bootstrap/dist/css/bootstrap.css",
    "bower_components/jquery-ui/themes/smoothness/jquery-ui.css",
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/popper.js/dist/popper.js",
    "bower_components/jquery-ui/jquery-ui.js",
    "node_modules/bootstrap/dist/js/bootstrap.js",
    // Images and Icons
    "static/fontawesome-all.js",
    "img/background.jpg",
    // JSON
    "classes.json"
];

self.addEventListener("install", function(event) {
    //console.log('install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CACHED_URLS);
        })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith("hmw-cache")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", function(event) {
    let requestURL = new URL(event.request.url);
    if (requestURL.pathname === "/" || requestURL.pathname === "/index.html") {
        event.respondWith(
            chaches.open(CACHE_NAME).then(function(cache) {
                return cache.match("/index.html").then(function(cachedResponse) {
                    let fetchPromise = fetch("/index.html").then(function(networkResponse) {
                        cache.put("/index.html", networkResponse.clone());
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
    } else if (requestURL.pathname === "classes.json") {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(networkResponse) {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(function() {
                    return caches.match(event.request);
                })
            })
        );
    } else if (CACHED_URLS.includes(requestURL.href) || CACHED_URLS.includes(requestURL.pathname)) {
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        })
    }
});

/*self.addEventListener("fetch", function(event) {
    if (event.request.url.includes("/bootstrap.css")) {
        console.log("Fetch request for: ", event.request.url);
        event.respondWith(
            new Response(
                ".page-title {background: darkblue!important;}", { headers: {"Content-Type": "text/css"}})
        )
    }
});*/

/*self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request).then((function(response){
                if(response) {
                    return response;
                } else if(event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("index-offline.html");
                }
            }));
        })
    )
});*/

/*
const responseContent = "<html><body><style> body {text-align:center; background-color: #333; color: #eee;}</style>" +
    "<h1>Homework App</h1><p>We keep you in sync with your homework!</p>" +
    "<p>There seems to be a problem with your connection!</p>" +
    "<p>We look forward to telling you about our app when you will be online again.</p></body></html>";

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return new Response(responseContent, {headers: {"Content-Type": "text/html"}});
        })
    );
});*/