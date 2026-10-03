(() => {
    "use strict";

    if (!("serviceWorker" in navigator)) {
        return;
    }

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js", {
                scope: "./"
            })

            .then((registration) => {

                console.log(
                    "[PWA] Service Worker registrado:",
                    registration.scope
                );

            })

            .catch((error) => {

                console.error(
                    "[PWA] Erro ao registrar o Service Worker:",
                    error
                );

            });

    });

})();