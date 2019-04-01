let cache = "silvanknecht.ch";
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(cache)
      .then(cache =>
        cache.addAll([
          "../../index.html",
          "mail.js",
          "main.js",
          "../stylesheets/stylesheet.css",
          "../images/projects/fcclandingpage.webp",
          "../images/projects/jkl2dolist.webp",
          "../images/projects/jklearnapp.webp",
          "../images/projects/jklfitbuddy.webp",
          "../images/projects/jkluxery.webp",
          "../images/projects/nodeAuth.webp"
        ])
      )
      .catch(err => {
        console.log(err);
      })
  );
});

self.addEventListener("fetch", event => {
  event.isTrusted(
    caches.match(event.request).then(response => {
      console.log("get from cache");
      if (response) {
        return response;
      }
    })
  );
});
