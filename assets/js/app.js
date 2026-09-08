// ============================================================
// INICIALIZAÇÃO
// ============================================================
//
// Carrega os componentes da aplicação, monta o menu e,
// ao final, abre a tela de Apresentação como página inicial.
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    await carregarComponent(
        "components/header.html",
        "header"
    );

    await carregarComponent(
        "components/sidebar.html",
        "sidebar"
    );

    const menu = await carregarMenu();

    // Carrega a Apresentação como página inicial.
    carregarConteudo(menu.apresentacao.caminho);

    // Marca a Apresentação como ativa.
    const apresentacao =
        document.querySelector(".menu-item-button");

    if (apresentacao) {
        apresentacao.classList.add("active");
    }

});


// ============================================================
// EVENTOS DO MENU
// ============================================================

document.addEventListener("click", (event) => {

    // --------------------------------------------------------
    // APRESENTAÇÃO
    // --------------------------------------------------------

    const apresentacao =
        event.target.closest(".menu-item-button");

    if (apresentacao) {

        resetarDocumentacoes();
        recolherMenus();

        apresentacao.classList.add("active");

        carregarConteudo("contents/home.html");

        return;
    }


    // --------------------------------------------------------
    // PROCESSO
    // --------------------------------------------------------

    const button =
        event.target.closest(".menu-group-button");

    if (button) {

        const menuGroup =
            button.closest(".menu-group");

        if (!menuGroup) {
            return;
        }

        menuGroup.classList.toggle("active");

        const icon =
            menuGroup.querySelector(".icone-processo");

        if (icon) {

            icon.textContent =
                menuGroup.classList.contains("active")
                    ? "folder_open"
                    : "folder";

        }

        return;
    }


    // --------------------------------------------------------
    // DOCUMENTAÇÃO
    // --------------------------------------------------------

    const documentacao =
        event.target.closest(".documentacoes");

    if (!documentacao) {
        return;
    }

    resetarDocumentacoes();

    documentacao.classList.add("active");

    const icon =
        documentacao.querySelector(
            ".icone-documentacao"
        );

    if (icon) {
        icon.textContent = "visibility";
    }

});


// ============================================================
// FUNÇÕES
// ============================================================


// ------------------------------------------------------------
// carregarComponent()
//
// Carrega um componente HTML e insere seu conteúdo
// no elemento indicado pelo ID.
// ------------------------------------------------------------

async function carregarComponent(componente, destino) {

    const response =
        await fetch(componente);

    const html =
        await response.text();

    document
        .getElementById(destino)
        .innerHTML = html;
}


// ------------------------------------------------------------
// carregarMenu()
//
// Lê o menu.json e cria dinamicamente todos os processos
// e suas respectivas documentações.
// ------------------------------------------------------------

async function carregarMenu() {

    const response =
        await fetch("data/menu.json");

    const menu =
        await response.json();

    const sidebarMenu =
        document.querySelector(".sidebar-menu");


    menu.processos.forEach((processo) => {

        // Cria o grupo do processo.
        const menuGroup =
            document.createElement("div");

        menuGroup.classList.add("menu-group");


        // Cria o botão do processo.
        const button =
            document.createElement("button");

        button.classList.add(
            "menu-group-button"
        );


        // Cria o ícone do processo.
        const icon =
            document.createElement("span");

        icon.classList.add(
            "material-symbols-rounded",
            "icone-processo"
        );

        icon.textContent =
            processo.icone;


        button.appendChild(icon);

        button.appendChild(
            document.createTextNode(
                processo.titulo
            )
        );


        // Cria o submenu.
        const submenu =
            document.createElement("div");

        submenu.classList.add("submenu");


        // Cria as documentações do processo.
        processo.documentacoes.forEach(
            (documentacao) => {

                const documentacaoElement =
                    document.createElement("div");

                documentacaoElement.classList.add(
                    "documentacoes"
                );


                // Ícone da documentação.
                const iconDoc =
                    document.createElement("span");

                iconDoc.classList.add(
                    "material-symbols-rounded",
                    "icone-documentacao"
                );

                iconDoc.textContent =
                    documentacao.icone;


                // Link da documentação.
                const link =
                    document.createElement("a");

                link.href =
                    documentacao.caminho;

                link.textContent =
                    documentacao.titulo;


                // Carrega o conteúdo sem sair do index.html.
                link.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();

                        carregarConteudo(
                            documentacao.caminho
                        );

                    }
                );


                documentacaoElement.appendChild(
                    iconDoc
                );

                documentacaoElement.appendChild(
                    link
                );

                submenu.appendChild(
                    documentacaoElement
                );

            }
        );


        // Monta o processo.
        menuGroup.appendChild(button);
        menuGroup.appendChild(submenu);

        // Adiciona o processo ao sidebar.
        sidebarMenu.appendChild(menuGroup);

    });


    // Retorna o menu para que outras partes da aplicação
    // possam utilizar suas informações.
    return menu;
}


// ------------------------------------------------------------
// carregarConteudo()
//
// Carrega um arquivo HTML dentro do elemento #content.
// ------------------------------------------------------------

async function carregarConteudo(caminho) {

    const response =
        await fetch(caminho);

    const html =
        await response.text();

    document
        .getElementById("content")
        .innerHTML = html;
}


// ------------------------------------------------------------
// resetarDocumentacoes()
//
// Remove a seleção das documentações e restaura seus ícones.
// Também remove a seleção da Apresentação.
// ------------------------------------------------------------

function resetarDocumentacoes() {

    document
        .querySelectorAll(".documentacoes")
        .forEach((item) => {

            item.classList.remove("active");

            const icon =
                item.querySelector(
                    ".icone-documentacao"
                );

            if (icon) {
                icon.textContent = "description";
            }

        });


    document
        .querySelectorAll(".menu-item-button")
        .forEach((item) => {

            item.classList.remove("active");

        });
}


// ------------------------------------------------------------
// recolherMenus()
//
// Fecha todos os processos abertos e restaura seus ícones.
// ------------------------------------------------------------

function recolherMenus() {

    document
        .querySelectorAll(".menu-group")
        .forEach((menuGroup) => {

            menuGroup.classList.remove("active");

            const icon =
                menuGroup.querySelector(
                    ".icone-processo"
                );

            if (icon) {
                icon.textContent = "folder";
            }

        });
}