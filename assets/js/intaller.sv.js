if ("serviceWorker" in navigator) {
    if (navigator.serviceWorker.controller) {
      console.log("[Barber Tech] Service Worker encontrado");
    } else {
      // Register the service worker
      navigator.serviceWorker
        .register("service-worker.js", {
          scope: "./"
        })
        .then(function (reg) {
          console.log("[Barber Tech] Service Worker registrado: " + reg.scope);
        });
    }
  }