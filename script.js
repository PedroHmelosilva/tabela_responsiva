//Função que renderiza a tabela
const tabela = document.getElementById('tabela');
const inputPesquisa = document.getElementById('pesquisa');
let dadosFiliais = [];

function renderizarTabela(dados) {
    tabela.innerHTML = ''; 
    dados.forEach(filial => {
        const modalId = `modalFilial-${filial.id}`;
        const linha = document.createElement('tr');

        linha.innerHTML = `
          <th scope="row">${filial.id}</th>
          <td>${filial.nome}</td>
          <td>${filial.status}</td>
          <td>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
                  <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                </svg>
            </button>
            
            <div class="modal fade" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="${modalId}Label">Detalhes da Filial</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                  </div>
                  <div class="modal-body">
                    <p><strong>Nome:</strong> ${filial.nome}</p>
                    <p><strong>Status:</strong> ${filial.status}</p>
                    <p><strong>Última venda:</strong> ${filial.dataUltimaVenda}</p>
                    <p><strong>Responsável:</strong> ${filial.responsavel}</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        `;
        tabela.appendChild(linha);
    });
}

//Vizualização dos dados da tabela
fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        dadosFiliais = data;
        renderizarTabela(dadosFiliais);
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));

//Função de pesquisa
inputPesquisa.addEventListener('input', () => {
    const termo = inputPesquisa.value.toLowerCase();

    const resultados = dadosFiliais.filter(filial =>
        filial.nome.toLowerCase().includes(termo) ||
        filial.status.toLowerCase().includes(termo) || 
        filial.id.toString().includes(termo)
    );
    
    renderizarTabela(resultados)
});

//Sidebar
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    function toggleNav() {
        nav.classList.toggle('nav-active');
        
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        burger.classList.toggle('toggle');
    }
    
    burger.addEventListener('click', toggleNav);
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                toggleNav();
            }
        });
    });
});