let cacheName = "silvanknecht.ch";
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache =>
        cache.addAll([
          "/",
          "/javascripts/mail.js",
          "/javascripts/main.js",
          "/stylesheets/stylesheet.css",
          "/images/projects/fcclandingpage.webp",
          "/images/projects/jkl2dolist.webp",
          "/images/projects/jklearnapp.webp",
          "/images/projects/jklfitbuddy.webp",
          "/images/projects/jkluxery.webp",
          "/images/projects/nodeAuth.webp",
          "/images/silvanknecht.jpg",
          "/images/welcome-background/screen2.JPG",
          "/images/technologies/javascript.jpg",
          "/images/technologies/nodejs.jpg",
          "/images/technologies/mongodb.jpg",
          "/images/technologies/html-css-javascript.jpg",
          "/images/technologies/leaflet.jpg",
          "/images/technologies/bootstrap.jpg",
          "/images/technologies/play.jpg",
          "/images/technologies/html.jpg",
          "/images/technologies/css.jpg",
          "https://use.fontawesome.com/releases/v5.7.2/js/all.js"
        ])
      )
      .catch(err => {
        console.log(err);
      })
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response) {
            return response;
        }
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(function (response) {
            if (!response || response.status !== 200) {
                return response;
            }
            var responseToCache = response.clone();
            caches.open(cacheName).then(function (cache) {
                cache.put(event.request, responseToCache);
            });
            return response;
        }).catch(error => {
            //if (event.request.method === 'GET' &&
            //    event.request.headers.get('accept').includes('text/html')) {
            //    return caches.match(offlineUrl);
            //}
        });
    }));
});
