/* =========================================================
   CONFIGURAÇÃO DA APLICAÇÃO
   ========================================================= */

/*
 * Descobre automaticamente o caminho base da aplicação.
 *
 * No GitHub Pages:
 *
 * /DevTech.Portfolio.SENAI.DocumentacaoProcessosGEEP
 *
 * Localmente, normalmente será:
 *
 * ""
 */
const BASE_PATH =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? ""
        : "/DevTech.Portfolio.SENAI.DocumentacaoProcessosGEEP";

/*
 * Menu carregado do JSON.
 *
 * É mantido em escopo global para que os eventos
 * de navegação possam utilizá-lo.
 */
let menuAtual = null;


/* =========================================================
   DOMContentLoaded
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* =================================================
           CARREGAR COMPONENTES
           ================================================= */

        await carregarComponent(
            "components/header.html",
            "header"
        );

        await carregarComponent(
            "components/sidebar.html",
            "sidebar"
        );


        /* =================================================
           CARREGAR MENU
           ================================================= */

        const menu =
            await carregarMenu();


        menuAtual =
            menu;


        /* =================================================
           CARREGAR ROTA ATUAL
           ================================================= */

        await navegarPara(
            obterRotaAtual(),
            menu,
            false
        );

    }
);


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
             * Impede o comportamento padrão.
             */

            event.preventDefault();


            /*
             * Impede que o evento continue
             * sendo processado.
             */

            event.stopPropagation();


            /*
             * Obtém a rota armazenada no elemento.
             */

            const rota =
                documentacao.dataset.rota;


            if (!rota) {

                console.error(
                    "Documentação sem rota:",
                    documentacao
                );

                return;
            }


            /*
             * Realiza a navegação.
             */

            navegarPara(
                rota,
                menuAtual
            );


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


            if (
                menuAtual &&
                menuAtual.apresentacao
            ) {

                navegarPara(
                    menuAtual.apresentacao.rota,
                    menuAtual
                );

            }


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
   EVENTO DO HISTÓRICO DO NAVEGADOR
   ========================================================= */

/*
 * Executado quando o usuário utiliza:
 *
 * - botão Voltar;
 * - botão Avançar;
 * - history.back();
 * - history.forward().
 */

window.addEventListener(
    "popstate",
    () => {

        if (!menuAtual) {

            return;
        }


        navegarPara(
            obterRotaAtual(),
            menuAtual,
            false
        );

    }
);


/* =========================================================
   OBTER ROTA ATUAL
   ========================================================= */

function obterRotaAtual() {

    /*
     * Se existir uma rota no hash,
     * utiliza ela.
     *
     * Exemplo:
     *
     * #/processos/projeto-de-curso/introducao
     *
     * vira:
     *
     * /processos/projeto-de-curso/introducao
     */

    if (window.location.hash) {

        let rota =
            window.location.hash.substring(1);

        if (!rota.startsWith("/")) {
            rota = "/" + rota;
        }

        return normalizarRota(rota);
    }


    /*
     * Caso não exista hash,
     * considera a rota tradicional.
     */

    let caminho =
        window.location.pathname;


    if (
        BASE_PATH &&
        caminho.startsWith(BASE_PATH)
    ) {

        caminho =
            caminho.substring(
                BASE_PATH.length
            );
    }


    if (!caminho.startsWith("/")) {
        caminho = "/" + caminho;
    }


    return normalizarRota(caminho);
}



/* =========================================================
   NORMALIZAR ROTA
   ========================================================= */

function normalizarRota(
    rota
) {

    if (!rota) {

        return "/";

    }


    let resultado =
        rota.trim();


    /*
     * Se alguém informar uma URL
     * completa, extrai somente o pathname.
     */

    try {

        if (
            resultado.startsWith(
                "http://"
            ) ||
            resultado.startsWith(
                "https://"
            )
        ) {

            resultado =
                new URL(
                    resultado
                ).pathname;

        }

    } catch (error) {

        console.error(
            "Erro ao normalizar rota:",
            error
        );

    }


    /*
     * Remove o BASE_PATH caso a rota
     * já venha com o caminho do projeto.
     */

    if (
        BASE_PATH &&
        resultado.startsWith(
            BASE_PATH
        )
    ) {

        resultado =
            resultado.substring(
                BASE_PATH.length
            );

    }


    /*
     * Garante "/".
     */

    if (
        !resultado.startsWith("/")
    ) {

        resultado =
            "/" + resultado;

    }


    /*
     * Remove barras duplicadas.
     */

    resultado =
        resultado.replace(
            /\/+/g,
            "/"
        );


    /*
     * Remove "/" final,
     * exceto na raiz.
     */

    if (
        resultado.length > 1
    ) {

        resultado =
            resultado.replace(
                /\/$/,
                ""
            );

    }


    return resultado || "/";

}


/* =========================================================
   LOCALIZAR PÁGINA PELA ROTA
   ========================================================= */

function localizarPaginaPorRota(
    menu,
    rota
) {

    if (!menu) {

        return null;

    }


    const rotaNormalizada =
        normalizarRota(
            rota
        );


    /* =====================================================
       APRESENTAÇÃO
       ===================================================== */

    if (
        menu.apresentacao
    ) {

        const rotaApresentacao =
            normalizarRota(
                menu.apresentacao.rota || "/"
            );


        if (
            rotaApresentacao ===
            rotaNormalizada
        ) {

            return {
                ...menu.apresentacao,
                tipo: "apresentacao"
            };

        }

    }


    /* =====================================================
       PROCESSOS
       ===================================================== */

    if (
        Array.isArray(
            menu.processos
        )
    ) {

        for (
            const processo of menu.processos
        ) {

            if (
                !Array.isArray(
                    processo.documentacoes
                )
            ) {

                continue;

            }


            for (
                const documentacao of processo.documentacoes
            ) {

                const rotaDocumentacao =
                    normalizarRota(
                        documentacao.rota
                    );


                if (
                    rotaDocumentacao ===
                    rotaNormalizada
                ) {

                    return {
                        ...documentacao,
                        tipo: "documentacao",
                        processo: processo
                    };

                }

            }

        }

    }


    return null;

}


/* =========================================================
   NAVEGAR PARA UMA ROTA
   ========================================================= */

async function navegarPara(
    rota,
    menu,
    atualizarHistorico = true
) {

    if (!menu) {

        console.error(
            "Menu não carregado."
        );

        return;

    }


    /*
     * Normaliza a rota.
     */

    const rotaNormalizada =
        normalizarRota(
            rota
        );


    /*
     * Localiza a página correspondente
     * no menu.json.
     */

    const pagina =
        localizarPaginaPorRota(
            menu,
            rotaNormalizada
        );


    /* =====================================================
       ROTA NÃO ENCONTRADA
       ===================================================== */

    if (!pagina) {

        console.warn(
            "Rota não encontrada:",
            rotaNormalizada
        );


        /*
         * Se a rota não existir,
         * utiliza a apresentação como fallback.
         */

        const paginaInicial =
            localizarPaginaPorRota(
                menu,
                "/"
            );


        if (
            paginaInicial
        ) {

            await navegarPara(
                paginaInicial.rota || "/",
                menu,
                atualizarHistorico
            );

        }

        return;

    }


    /* =====================================================
       ATUALIZAR HISTÓRICO
       ===================================================== */

    if (
        atualizarHistorico
    ) {

        const url =
            construirUrl(
                pagina.rota
            );


        /*
         * Evita adicionar uma entrada
         * desnecessária ao histórico.
         */

        if (
            window.location.pathname !==
            url
        ) {

            window.history.pushState(
                {
                    rota: pagina.rota
                },
                "",
                `#${pagina.rota}`
            );


        }

    }


    /* =====================================================
       RESETAR ESTADOS
       ===================================================== */

    resetarDocumentacoes();


    recolherMenus();


    /* =====================================================
       APRESENTAÇÃO
       ===================================================== */

    if (
        pagina.tipo ===
        "apresentacao"
    ) {

        const apresentacao =
            document.querySelector(
                ".menu-item-button"
            );


        if (apresentacao) {

            apresentacao.classList.add(
                "active"
            );

        }

    }


    /* =====================================================
       DOCUMENTAÇÃO
       ===================================================== */

    if (
        pagina.tipo ===
        "documentacao"
    ) {

        const documentacaoElement =
            document.querySelector(
                `.documentacoes[data-rota="${CSS.escape(
                    pagina.rota
                )}"]`
            );


        if (
            documentacaoElement
        ) {

            documentacaoElement.classList.add(
                "active"
            );


            /*
             * Alterar ícone da documentação.
             */

            const icon =
                documentacaoElement.querySelector(
                    ".icone-documentacao"
                );


            if (icon) {

                icon.textContent =
                    "visibility";

            }


            /*
             * Abrir automaticamente
             * o grupo do processo.
             */

            const menuGroup =
                documentacaoElement.closest(
                    ".menu-group"
                );


            if (menuGroup) {

                menuGroup.classList.add(
                    "active"
                );


                const processIcon =
                    menuGroup.querySelector(
                        ".icone-processo"
                    );


                if (processIcon) {

                    processIcon.textContent =
                        "folder_open";

                }

            }

        }

    }


    /* =====================================================
       CARREGAR CONTEÚDO
       ===================================================== */

    await carregarConteudo(
        pagina.caminho
    );


    /* =====================================================
       FECHAR MENU MOBILE
       ===================================================== */

    fecharMenuMobile();

}


/* =========================================================
   CONSTRUIR URL
   ========================================================= */

function construirUrl(
    rota
) {

    const rotaNormalizada =
        normalizarRota(
            rota
        );


    /*
     * Rota raiz.
     */

    if (
        rotaNormalizada === "/"
    ) {

        return (
            BASE_PATH
                ? `${BASE_PATH}/`
                : "/"
        );

    }


    /*
     * Demais rotas.
     */

    return (
        BASE_PATH
            ? `${BASE_PATH}${rotaNormalizada}`
            : rotaNormalizada
    );

}


/* =========================================================
   CONSTRUIR CAMINHO DE ARQUIVO
   ========================================================= */

function construirCaminhoArquivo(
    caminho
) {

    if (!caminho) {

        return "";

    }


    /*
     * Se já for uma URL absoluta,
     * não modifica.
     */

    if (
        caminho.startsWith("http://") ||
        caminho.startsWith("https://") ||
        caminho.startsWith("data:")
    ) {

        return caminho;

    }


    /*
     * Remove ./ inicial.
     */

    let caminhoNormalizado =
        caminho.replace(
            /^\.\/+/,
            ""
        );


    /*
     * Remove / inicial.
     */

    caminhoNormalizado =
        caminhoNormalizado.replace(
            /^\/+/,
            ""
        );


    /*
     * Monta o caminho considerando
     * a raiz do projeto no GitHub Pages.
     */

    return `${BASE_PATH}/${caminhoNormalizado}`;

}


/* =========================================================
   CARREGAR COMPONENTE
   ========================================================= */

async function carregarComponent(
    componente,
    destino
) {

    try {

        const url =
            construirCaminhoArquivo(
                componente
            );


        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                `Erro ${response.status} ao carregar ${url}`
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

        const url =
            construirCaminhoArquivo(
                "data/menu.json"
            );


        const response =
            await fetch(
                url
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
           APRESENTAÇÃO
           ================================================= */

        const apresentacao =
            document.querySelector(
                ".menu-item-button"
            );


        if (
            apresentacao &&
            menu.apresentacao
        ) {

            apresentacao.dataset.rota =
                menu.apresentacao.rota || "/";

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
                         * Guarda o caminho do
                         * arquivo HTML.
                         */

                        documentacaoElement.dataset.caminho =
                            documentacao.caminho;


                        /*
                         * Guarda o ID.
                         */

                        documentacaoElement.dataset.id =
                            documentacao.id;


                        /*
                         * Guarda a rota.
                         *
                         * Esta é a informação utilizada
                         * pelo sistema de navegação.
                         */

                        documentacaoElement.dataset.rota =
                            documentacao.rota;


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
                titulo:
                    "Apresentação",

                rota:
                    "/",

                caminho:
                    "contents/home.html"
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

        const url =
            construirCaminhoArquivo(
                caminho
            );


        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                `Erro ${response.status} ao carregar ${url}`
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


        /*
         * Também garante que a janela
         * volte ao topo.
         */

        window.scrollTo(
            0,
            0
        );


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

                <p>
                    <strong>Detalhes:</strong>
                    ${error.message}
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
                root:
                    content,

                threshold:
                    0.3

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