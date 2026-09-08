// ============================================================
// EVENTOS
// ============================================================


// ------------------------------------------------------------
// INICIALIZAÇÃO DA APLICAÇÃO
// ------------------------------------------------------------
//
// Aguarda o carregamento do DOM.
//
// A ordem é importante:
//
// 1. Carregar o Header
// 2. Carregar o Sidebar
// 3. Carregar o menu através do JSON
//
// Precisamos carregar o Sidebar antes do menu porque
// carregarMenu() precisa encontrar o elemento ".sidebar-menu".
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {

    await carregarComponent(
        "components/header.html",
        "header"
    );

    await carregarComponent(
        "components/sidebar.html",
        "sidebar"
    );

    await carregarMenu();

});


// ============================================================
// CLIQUES NO MENU LATERAL
// ============================================================

document.addEventListener("click", (event) => {


    // ========================================================
    // APRESENTAÇÃO
    // ========================================================

    const apresentacao =
        event.target.closest(".menu-item-button");


    if (apresentacao) {

        // Remove o estado active de outros botões
        // de apresentação.
        document
            .querySelectorAll(".menu-item-button")
            .forEach((item) => {

                item.classList.remove("active");

            });


        // Remove a seleção das documentações.
        resetarDocumentacoes();


        // Fecha todos os processos.
        recolherMenus();


        // Marca Apresentação como ativa.
        apresentacao.classList.add("active");


        // Carrega a página inicial.
        carregarConteudo(
            "contents/home.html"
        );


        return;
    }


    // ========================================================
    // PROCESSOS
    // ========================================================

    const button =
        event.target.closest(".menu-group-button");


    if (button) {

        // Localiza o menu-group correspondente
        // ao botão clicado.
        const menuGroup =
            button.closest(".menu-group");


        if (!menuGroup) {
            return;
        }


        // Abre ou fecha o processo.
        menuGroup.classList.toggle("active");


        // Localiza o ícone do processo.
        const icon =
            menuGroup.querySelector(".icone-processo");


        if (icon) {

            // Processo aberto.
            if (
                menuGroup.classList.contains("active")
            ) {

                icon.textContent = "folder_open";

            }

            // Processo fechado.
            else {

                icon.textContent = "folder";

            }

        }


        return;
    }


    // ========================================================
    // DOCUMENTAÇÃO
    // ========================================================

    const documentacao =
        event.target.closest(".documentacoes");


    if (!documentacao) {
        return;
    }


    // Remove a seleção das outras documentações.
    resetarDocumentacoes();


    // Marca a documentação clicada como ativa.
    documentacao.classList.add("active");


    // Localiza o ícone da documentação.
    const iconDoc =
        documentacao.querySelector(
            ".icone-documentacao"
        );


    if (iconDoc) {

        // Altera o ícone para indicar
        // que a documentação está selecionada.
        iconDoc.textContent = "visibility";

    }

});


// ============================================================
// FUNÇÕES
// ============================================================


// ------------------------------------------------------------
// carregarComponent()
// ------------------------------------------------------------
//
// Responsabilidade:
//
// Carregar um arquivo HTML externo e inserir seu conteúdo
// dentro de um elemento existente no index.html.
//
// Exemplo:
//
// carregarComponent(
//     "components/header.html",
//     "header"
// );
//
// O resultado será:
//
// components/header.html
//          ↓
//       #header
//
// ------------------------------------------------------------

async function carregarComponent(componente, destino) {

    // Busca o arquivo.
    const response =
        await fetch(componente);


    // Converte a resposta para texto.
    const html =
        await response.text();


    // Insere o HTML no elemento de destino.
    document
        .getElementById(destino)
        .innerHTML = html;

}


// ------------------------------------------------------------
// carregarMenu()
// ------------------------------------------------------------
//
// Responsabilidade:
//
// 1. Buscar o menu.json.
// 2. Converter o JSON para um objeto JavaScript.
// 3. Percorrer todos os processos.
// 4. Criar cada processo.
// 5. Percorrer as documentações de cada processo.
// 6. Criar cada documentação.
// 7. Inserir tudo no sidebar.
//
// Antes:
//
// const processo = menu.processos[0];
//
// Isso permitia criar somente o primeiro processo.
//
// Agora:
//
// menu.processos.forEach(...)
//
//
// Portanto, todos os processos serão gerados.
// ------------------------------------------------------------

async function carregarMenu() {


    // --------------------------------------------------------
    // BUSCAR O JSON
    // --------------------------------------------------------

    const response =
        await fetch("data/menu.json");


    // --------------------------------------------------------
    // CONVERTER JSON PARA OBJETO JAVASCRIPT
    // --------------------------------------------------------

    const menu =
        await response.json();


    // --------------------------------------------------------
    // LOCALIZAR O MENU DO SIDEBAR
    // --------------------------------------------------------

    const sidebarMenu =
        document.querySelector(".sidebar-menu");


    // --------------------------------------------------------
    // PERCORRER TODOS OS PROCESSOS
    // --------------------------------------------------------
    //
    // menu.processos é um array.
    //
    // O forEach() executará o código abaixo uma vez
    // para cada processo encontrado.
    //
    // Exemplo:
    //
    // 1ª execução → Projeto de Curso
    // 2ª execução → Oferta de Turmas
    //
    // Se futuramente adicionarmos:
    //
    // 3ª execução → Outro Processo
    //
    // ele também será criado automaticamente.
    // --------------------------------------------------------

    menu.processos.forEach((processo) => {


        // ====================================================
        // CRIAR O CONTAINER DO PROCESSO
        // ====================================================

        // Cria:
        //
        // <div></div>
        //
        const menuGroup =
            document.createElement("div");


        // Adiciona:
        //
        // <div class="menu-group">
        //
        menuGroup.classList.add(
            "menu-group"
        );


        // ====================================================
        // CRIAR O BOTÃO DO PROCESSO
        // ====================================================

        // Cria:
        //
        // <button></button>
        //
        const button =
            document.createElement("button");


        // Adiciona:
        //
        // <button class="menu-group-button">
        //
        button.classList.add(
            "menu-group-button"
        );


        // ====================================================
        // CRIAR O ÍCONE DO PROCESSO
        // ====================================================

        const icon =
            document.createElement("span");


        // Adiciona as classes necessárias
        // para o Material Symbols e para
        // identificar o ícone do processo.
        icon.classList.add(
            "material-symbols-rounded",
            "icone-processo"
        );


        // O nome do ícone vem do JSON.
        //
        // Exemplo:
        //
        // "icone": "folder"
        //
        icon.textContent =
            processo.icone;


        // Adiciona o ícone dentro do botão.
        button.appendChild(icon);


        // ====================================================
        // ADICIONAR O TÍTULO DO PROCESSO
        // ====================================================

        // O título também vem do JSON.
        //
        // Exemplo:
        //
        // "titulo": "Projeto de Curso"
        //
        button.appendChild(
            document.createTextNode(
                processo.titulo
            )
        );


        // ====================================================
        // CRIAR O SUBMENU
        // ====================================================

        const submenu =
            document.createElement("div");


        // Adiciona:
        //
        // <div class="submenu">
        //
        submenu.classList.add(
            "submenu"
        );


        // ====================================================
        // PERCORRER AS DOCUMENTAÇÕES
        // ====================================================
        //
        // Cada processo possui seu próprio array
        // chamado "documentacoes".
        //
        // Exemplo:
        //
        // processo.documentacoes
        //
        // também é um array.
        // ----------------------------------------------------

        processo.documentacoes.forEach(
            (documentacao) => {


                // ============================================
                // CRIAR O CONTAINER DA DOCUMENTAÇÃO
                // ============================================

                const documentacaoElement =
                    document.createElement("div");


                // Adiciona:
                //
                // <div class="documentacoes">
                //
                documentacaoElement.classList.add(
                    "documentacoes"
                );


                // ============================================
                // CRIAR O ÍCONE DA DOCUMENTAÇÃO
                // ============================================

                const iconDoc =
                    document.createElement("span");


                // Adiciona as classes.
                iconDoc.classList.add(
                    "material-symbols-rounded",
                    "icone-documentacao"
                );


                // O ícone vem do JSON.
                //
                // Exemplo:
                //
                // "icone": "description"
                //
                iconDoc.textContent =
                    documentacao.icone;


                // ============================================
                // CRIAR O LINK
                // ============================================

                const link =
                    document.createElement("a");


                // Define o caminho do documento.
                //
                // Exemplo:
                //
                // contents/processos/
                // projeto_de_curso/
                // cadastrar_curso.html
                //
                link.href =
                    documentacao.caminho;


                // Define o texto que será exibido.
                link.textContent =
                    documentacao.titulo;


                // ============================================
                // EVENTO DO LINK
                // ============================================
                //
                // O comportamento padrão de um link seria
                // carregar uma nova página.
                //
                // Como nosso sistema trabalha dentro de
                // index.html, vamos impedir essa navegação.
                // ============================================

                link.addEventListener(
                    "click",
                    (event) => {

                        // Impede a navegação tradicional.
                        event.preventDefault();


                        // Carrega o conteúdo dentro
                        // do elemento #content.
                        carregarConteudo(
                            documentacao.caminho
                        );

                    }
                );


                // ============================================
                // MONTAR A DOCUMENTAÇÃO
                // ============================================

                // Adiciona o ícone.
                documentacaoElement.appendChild(
                    iconDoc
                );


                // Adiciona o link.
                documentacaoElement.appendChild(
                    link
                );


                // Adiciona a documentação ao submenu.
                submenu.appendChild(
                    documentacaoElement
                );

            }
        );


        // ====================================================
        // MONTAR O PROCESSO
        // ====================================================

        // Adiciona o botão ao processo.
        menuGroup.appendChild(
            button
        );


        // Adiciona o submenu ao processo.
        menuGroup.appendChild(
            submenu
        );


        // ====================================================
        // ADICIONAR O PROCESSO AO SIDEBAR
        // ====================================================

        sidebarMenu.appendChild(
            menuGroup
        );

    });

}


// ------------------------------------------------------------
// carregarConteudo()
// ------------------------------------------------------------
//
// Responsabilidade:
//
// Carregar um arquivo HTML e substituir o conteúdo
// atualmente presente dentro de #content.
//
// Exemplo:
//
// carregarConteudo(
//     "contents/home.html"
// );
//
// ------------------------------------------------------------

async function carregarConteudo(caminho) {


    // Busca o arquivo HTML.
    const response =
        await fetch(caminho);


    // Converte a resposta para texto.
    const html =
        await response.text();


    // Substitui o conteúdo do elemento #content.
    document
        .getElementById("content")
        .innerHTML = html;

}


// ------------------------------------------------------------
// resetarDocumentacoes()
// ------------------------------------------------------------
//
// Responsabilidade:
//
// Remover o estado "active" de todas as documentações.
//
// Também restaura o ícone de:
//
// visibility
//
// para:
//
// description
//
// Além disso, remove o estado "active" da Apresentação.
// ------------------------------------------------------------

function resetarDocumentacoes() {


    // Procura todas as documentações.
    document
        .querySelectorAll(".documentacoes")
        .forEach((item) => {


            // Remove active.
            item.classList.remove(
                "active"
            );


            // Localiza o ícone.
            const icon =
                item.querySelector(
                    ".icone-documentacao"
                );


            if (icon) {

                // Restaura o ícone.
                icon.textContent =
                    "description";

            }

        });


    // --------------------------------------------------------
    // RESETAR APRESENTAÇÃO
    // --------------------------------------------------------

    document
        .querySelectorAll(".menu-item-button")
        .forEach((item) => {

            item.classList.remove(
                "active"
            );

        });

}


// ------------------------------------------------------------
// recolherMenus()
// ------------------------------------------------------------
//
// Responsabilidade:
//
// Fechar todos os processos.
//
// Remove:
//
// active
//
// dos ".menu-group".
//
// Também restaura:
//
// folder_open
//
// para:
//
// folder
//
// ------------------------------------------------------------

function recolherMenus() {


    // Procura todos os processos.
    document
        .querySelectorAll(".menu-group")
        .forEach((menuGroup) => {


            // Remove active.
            //
            // O CSS fará o submenu desaparecer.
            menuGroup.classList.remove(
                "active"
            );


            // Localiza o ícone do processo.
            const icon =
                menuGroup.querySelector(
                    ".icone-processo"
                );


            if (icon) {

                // Restaura a pasta fechada.
                icon.textContent =
                    "folder";

            }

        });

}