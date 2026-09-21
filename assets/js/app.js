document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       CARREGAR COMPONENTES
       ===================================================== */

    await carregarComponent(
        "components/header.html",
        "header"
    );

    await carregarComponent(
        "components/sidebar.html",
        "sidebar"
    );


    /* =====================================================
       CARREGAR MENU
       ===================================================== */

    const menu = await carregarMenu();


    /* =====================================================
       CARREGAR PÁGINA INICIAL
       ===================================================== */

    if (
        menu.apresentacao &&
        menu.apresentacao.caminho
    ) {

        await carregarConteudo(
            menu.apresentacao.caminho
        );

    }


    /* =====================================================
       ATIVAR APRESENTAÇÃO
       ===================================================== */

    const apresentacao =
        document.querySelector(
            ".menu-item-button"
        );

    if (apresentacao) {

        apresentacao.classList.add(
            "active"
        );

    }

});


/* =========================================================
   EVENTO GLOBAL DE CLIQUE
   ========================================================= */

document.addEventListener(
    "click",
    (event) => {


        /* =================================================
           BOTÃO DO MENU MOBILE
           ================================================= */

        const mobileMenuButton =
            event.target.closest(
                "#mobile-menu-button"
            );


        if (mobileMenuButton) {

            alternarMenuMobile();

            return;
        }


        /* =================================================
           DOCUMENTAÇÃO
           ================================================= */

        const documentacao =
            event.target.closest(
                ".documentacoes"
            );


        if (documentacao) {

            /*
             * Impede qualquer comportamento
             * padrão de navegação.
             */

            event.preventDefault();


            /*
             * Impede que o clique continue
             * sendo processado por outros
             * listeners.
             */

            event.stopPropagation();


            /* ---------------------------------------------
               CAMINHO
               --------------------------------------------- */

            const caminho =
                documentacao.dataset.caminho;


            if (!caminho) {

                console.error(
                    "Documentação sem caminho:",
                    documentacao
                );

                return;
            }


            /* ---------------------------------------------
               RESETAR ESTADOS
               --------------------------------------------- */

            resetarDocumentacoes();


            /* ---------------------------------------------
               ATIVAR DOCUMENTAÇÃO
               --------------------------------------------- */

            documentacao.classList.add(
                "active"
            );


            /* ---------------------------------------------
               ALTERAR ÍCONE
               --------------------------------------------- */

            const icon =
                documentacao.querySelector(
                    ".icone-documentacao"
                );


            if (icon) {

                icon.textContent =
                    "visibility";

            }


            /* ---------------------------------------------
               CARREGAR CONTEÚDO
               --------------------------------------------- */

            carregarConteudo(
                caminho
            );


            /* ---------------------------------------------
               FECHAR MENU MOBILE
               --------------------------------------------- */

            fecharMenuMobile();


            return;
        }


        /* =================================================
           APRESENTAÇÃO
           ================================================= */

        const apresentacao =
            event.target.closest(
                ".menu-item-button"
            );


        if (apresentacao) {

            event.preventDefault();


            /* ---------------------------------------------
               RESETAR ESTADOS
               --------------------------------------------- */

            resetarDocumentacoes();

            recolherMenus();


            /* ---------------------------------------------
               ATIVAR APRESENTAÇÃO
               --------------------------------------------- */

            apresentacao.classList.add(
                "active"
            );


            /* ---------------------------------------------
               CARREGAR CONTEÚDO
               --------------------------------------------- */

            carregarConteudo(
                "contents/home.html"
            );


            /* ---------------------------------------------
               FECHAR MENU MOBILE
               --------------------------------------------- */

            fecharMenuMobile();


            return;
        }


        /* =================================================
           GRUPO DE PROCESSO
           ================================================= */

        const menuGroupButton =
            event.target.closest(
                ".menu-group-button"
            );


        if (menuGroupButton) {

            event.preventDefault();


            /* ---------------------------------------------
               LOCALIZAR GRUPO
               --------------------------------------------- */

            const menuGroup =
                menuGroupButton.closest(
                    ".menu-group"
                );


            if (!menuGroup) {

                return;
            }


            /* ---------------------------------------------
               ABRIR / FECHAR GRUPO
               --------------------------------------------- */

            menuGroup.classList.toggle(
                "active"
            );


            /* ---------------------------------------------
               ALTERAR ÍCONE
               --------------------------------------------- */

            const icon =
                menuGroup.querySelector(
                    ".icone-processo"
                );


            if (icon) {

                icon.textContent =
                    menuGroup.classList.contains(
                        "active"
                    )
                        ? "folder_open"
                        : "folder";

            }


            return;
        }


        /* =================================================
           CLIQUE FORA DO MENU
           ================================================= */

        const sidebar =
            document.getElementById(
                "sidebar"
            );


        if (
            sidebar &&
            sidebar.classList.contains(
                "mobile-open"
            ) &&
            !sidebar.contains(
                event.target
            )
        ) {

            fecharMenuMobile();

        }

    },
    true
);


/* =========================================================
   CARREGAR COMPONENTE
   ========================================================= */

async function carregarComponent(
    componente,
    destino
) {

    try {

        const response =
            await fetch(
                componente
            );


        if (!response.ok) {

            throw new Error(
                `Erro ${response.status} ao carregar ${componente}`
            );

        }


        const html =
            await response.text();


        const elemento =
            document.getElementById(
                destino
            );


        if (!elemento) {

            console.error(
                `Elemento #${destino} não encontrado.`
            );

            return;
        }


        elemento.innerHTML =
            html;


    } catch (error) {

        console.error(
            "Erro ao carregar componente:",
            error
        );

    }

}


/* =========================================================
   CARREGAR MENU
   ========================================================= */

async function carregarMenu() {

    try {

        const response =
            await fetch(
                "data/menu.json"
            );


        if (!response.ok) {

            throw new Error(
                `Erro ${response.status} ao carregar menu.json`
            );

        }


        const menu =
            await response.json();


        const sidebarMenu =
            document.querySelector(
                ".sidebar-menu"
            );


        if (!sidebarMenu) {

            console.error(
                "Elemento .sidebar-menu não encontrado."
            );

            return menu;
        }


        /* =================================================
           PROCESSOS
           ================================================= */

        menu.processos.forEach(
            (processo) => {


                /* -----------------------------------------
                   GRUPO
                   ----------------------------------------- */

                const menuGroup =
                    document.createElement(
                        "div"
                    );


                menuGroup.classList.add(
                    "menu-group"
                );


                /* -----------------------------------------
                   BOTÃO DO PROCESSO
                   ----------------------------------------- */

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.classList.add(
                    "menu-group-button"
                );


                /* -----------------------------------------
                   ÍCONE DO PROCESSO
                   ----------------------------------------- */

                const icon =
                    document.createElement(
                        "span"
                    );


                icon.classList.add(
                    "material-symbols-rounded",
                    "icone-processo"
                );


                icon.textContent =
                    processo.icone;


                /* -----------------------------------------
                   TEXTO DO PROCESSO
                   ----------------------------------------- */

                const textoProcesso =
                    document.createElement(
                        "span"
                    );


                textoProcesso.textContent =
                    processo.titulo;


                button.appendChild(
                    icon
                );


                button.appendChild(
                    textoProcesso
                );


                /* -----------------------------------------
                   SUBMENU
                   ----------------------------------------- */

                const submenu =
                    document.createElement(
                        "div"
                    );


                submenu.classList.add(
                    "submenu"
                );


                /* =================================================
                   DOCUMENTAÇÕES
                   ================================================= */

                processo.documentacoes.forEach(
                    (documentacao) => {


                        const documentacaoElement =
                            document.createElement(
                                "div"
                            );


                        documentacaoElement.classList.add(
                            "documentacoes"
                        );


                        /*
                         * Guarda o caminho da
                         * documentação no elemento.
                         */

                        documentacaoElement.dataset.caminho =
                            documentacao.caminho;


                        /*
                         * Guarda também o ID.
                         */

                        documentacaoElement.dataset.id =
                            documentacao.id;


                        /* -------------------------------------
                           ÍCONE
                           ------------------------------------- */

                        const iconDoc =
                            document.createElement(
                                "span"
                            );


                        iconDoc.classList.add(
                            "material-symbols-rounded",
                            "icone-documentacao"
                        );


                        iconDoc.textContent =
                            documentacao.icone;


                        /* -------------------------------------
                           TEXTO
                           ------------------------------------- */

                        const textoDocumentacao =
                            document.createElement(
                                "span"
                            );


                        textoDocumentacao.classList.add(
                            "documentacao-link"
                        );


                        textoDocumentacao.textContent =
                            documentacao.titulo;


                        /* -------------------------------------
                           MONTAR DOCUMENTAÇÃO
                           ------------------------------------- */

                        documentacaoElement.appendChild(
                            iconDoc
                        );


                        documentacaoElement.appendChild(
                            textoDocumentacao
                        );


                        /* -------------------------------------
                           ADICIONAR AO SUBMENU
                           ------------------------------------- */

                        submenu.appendChild(
                            documentacaoElement
                        );

                    }
                );


                /* -----------------------------------------
                   MONTAR GRUPO
                   ----------------------------------------- */

                menuGroup.appendChild(
                    button
                );


                menuGroup.appendChild(
                    submenu
                );


                /* -----------------------------------------
                   ADICIONAR AO SIDEBAR
                   ----------------------------------------- */

                sidebarMenu.appendChild(
                    menuGroup
                );

            }
        );


        return menu;


    } catch (error) {

        console.error(
            "Erro ao carregar menu:",
            error
        );


        return {

            apresentacao: {
                titulo: "Apresentação",
                caminho: "contents/home.html"
            },

            processos: []

        };

    }

}


/* =========================================================
   CARREGAR CONTEÚDO
   ========================================================= */

async function carregarConteudo(
    caminho
) {

    const content =
        document.getElementById(
            "content"
        );


    if (!content) {

        console.error(
            "Elemento #content não encontrado."
        );

        return;
    }


    if (!caminho) {

        console.error(
            "Caminho não informado."
        );

        return;
    }


    try {

        const response =
            await fetch(
                caminho
            );


        if (!response.ok) {

            throw new Error(
                `Erro ${response.status} ao carregar ${caminho}`
            );

        }


        const html =
            await response.text();


        /* ---------------------------------------------
           INSERIR CONTEÚDO
           --------------------------------------------- */

        content.innerHTML =
            html;


        /* ---------------------------------------------
           RESETAR SCROLL
           --------------------------------------------- */

        content.scrollTop =
            0;


        /* ---------------------------------------------
           CONFIGURAR GIFS
           --------------------------------------------- */

        configurarGifs();


    } catch (error) {

        console.error(
            "Erro ao carregar conteúdo:",
            error
        );


        content.innerHTML = `

            <div class="doc-page">

                <h1>
                    Erro ao carregar conteúdo
                </h1>

                <p>
                    Não foi possível carregar a documentação.
                </p>

                <p>
                    <strong>Arquivo:</strong>
                    ${caminho}
                </p>

            </div>

        `;

    }

}


/* =========================================================
   RESETAR DOCUMENTAÇÕES
   ========================================================= */

function resetarDocumentacoes() {

    document
        .querySelectorAll(
            ".documentacoes"
        )
        .forEach(
            (item) => {


                item.classList.remove(
                    "active"
                );


                const icon =
                    item.querySelector(
                        ".icone-documentacao"
                    );


                if (icon) {

                    icon.textContent =
                        "description";

                }

            }
        );


    document
        .querySelectorAll(
            ".menu-item-button"
        )
        .forEach(
            (item) => {

                item.classList.remove(
                    "active"
                );

            }
        );

}


/* =========================================================
   RECOLHER MENUS
   ========================================================= */

function recolherMenus() {

    document
        .querySelectorAll(
            ".menu-group"
        )
        .forEach(
            (menuGroup) => {


                menuGroup.classList.remove(
                    "active"
                );


                const icon =
                    menuGroup.querySelector(
                        ".icone-processo"
                    );


                if (icon) {

                    icon.textContent =
                        "folder";

                }

            }
        );

}


/* =========================================================
   CONFIGURAR GIFS
   ========================================================= */

function configurarGifs() {

    const content =
        document.getElementById(
            "content"
        );


    if (!content) {

        return;
    }


    const gifs =
        content.querySelectorAll(
            ".doc-figure img[src$='.gif']"
        );


    if (!gifs.length) {

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {


                        if (
                            !entry.isIntersecting
                        ) {

                            return;
                        }


                        const gif =
                            entry.target;


                        const src =
                            gif.src;


                        /*
                         * Reinicia o GIF
                         * quando ele entra
                         * na área visível.
                         */

                        gif.src =
                            "";


                        gif.src =
                            src;

                    }
                );

            },
            {
                root: content,
                threshold: 0.3
            }
        );


    gifs.forEach(
        (gif) => {

            observer.observe(
                gif
            );

        }
    );

}


/* =========================================================
   MENU MOBILE
   ========================================================= */

function alternarMenuMobile() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const button =
        document.getElementById(
            "mobile-menu-button"
        );


    if (
        !sidebar ||
        !button
    ) {

        return;
    }


    const aberto =
        sidebar.classList.toggle(
            "mobile-open"
        );


    button.setAttribute(
        "aria-expanded",
        aberto
    );


    const icon =
        button.querySelector(
            ".material-symbols-rounded"
        );


    if (icon) {

        icon.textContent =
            aberto
                ? "close"
                : "menu";

    }

}


/* =========================================================
   FECHAR MENU MOBILE
   ========================================================= */

function fecharMenuMobile() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const button =
        document.getElementById(
            "mobile-menu-button"
        );


    if (
        !sidebar ||
        !button
    ) {

        return;
    }


    sidebar.classList.remove(
        "mobile-open"
    );


    button.setAttribute(
        "aria-expanded",
        "false"
    );


    const icon =
        button.querySelector(
            ".material-symbols-rounded"
        );


    if (icon) {

        icon.textContent =
            "menu";

    }

}