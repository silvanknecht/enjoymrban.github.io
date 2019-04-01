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
          "/images/technologies/css.jpg"
        ])
      )
      .catch(err => {
        console.log(err);
      })
  );
});

self.addEventListener("fetch", function(event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
