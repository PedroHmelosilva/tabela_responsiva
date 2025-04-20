//Função que renderiza a tabela
const tabela = document.getElementById('tabela');
const inputPesquisa = document.getElementById('pesquisa');
const ctx = document.getElementById('grafico').getContext('2d');
let dadosFiliais = [];

function renderizarTabela(dados) {
    tabela.innerHTML = '';
    dados.forEach(filial => {
        const modalId = `modalFilial-${filial.id}`;
        // Remove modal if it already exists to prevent duplicates
        const oldModal = document.getElementById(modalId);
        if (oldModal) oldModal.remove();
        const linha = document.createElement('tr');
        linha.tabIndex = 0;
        linha.setAttribute('role', 'button');
        linha.setAttribute('aria-label', `Detalhes da filial ${filial.nome}`);
        linha.style.cursor = 'pointer';
        linha.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById(modalId));
            modal.show();
        });
        linha.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const modal = new bootstrap.Modal(document.getElementById(modalId));
                modal.show();
            }
        });
        linha.innerHTML = `
          <th scope="row">${filial.id}</th>
          <td>${filial.nome}</td>
          <td>${filial.status}</td>
          <td style="display:none"></td>
        `;
        tabela.appendChild(linha);

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = `
            <div class=\"modal fade\" id=\"${modalId}\" data-bs-backdrop=\"static\" data-bs-keyboard=\"false\" tabindex=\"-1\" aria-labelledby=\"${modalId}Label\" aria-hidden=\"true\">
              <div class=\"modal-dialog\">
                <div class=\"modal-content\">
                  <div class=\"modal-header\">
                    <h1 class=\"modal-title fs-5\" id=\"${modalId}Label\">Detalhes da Filial</h1>
                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Fechar\"></button>
                  </div>
                  <div class=\"modal-body\">
                    <p><strong>Nome:</strong> ${filial.nome}</p>
                    <p><strong>Status:</strong> ${filial.status}</p>
                    <p><strong>Vendas:</strong> ${filial.vendas}</p>
                    <p><strong>Meta:</strong> ${filial.meta}</p>
                    <p><strong>Última venda:</strong> ${filial.dataUltimaVenda}</p>
                    <p><strong>Responsável:</strong> ${filial.responsavel}</p>
                    <p><strong>Produtos Vendidos:</strong> ${filial.produtosVendidos}</p>
                  </div>
                  <div class=\"modal-footer\">
                    <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Fechar</button>
                  </div>
                </div>
              </div>
            </div>
        `;
        document.body.appendChild(modalDiv.firstElementChild);
    });
}

function renderizarGrafico(dados) {
    dados.forEach(filial => {
        //Graficos
        const grafico = new Chart(ctx, {
            type: 'bar', // tipos: 'line', 'pie', 'doughnut', 'bar', etc
            data: {
                labels: [filial.nome],
                datasets: [{
                    label: 'Vendas (mil R$)',
                    data: [filial.vendas],
                    backgroundColor: [
                        '#f5e003', '#d1a33c', '#2c3e50', '#7f8c8d'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
}

function atualizarEstadoMenu() {
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach((link, index) => {
        if (index === 0) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

//Vizualização dos dados da tabela
fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        dadosFiliais = data;
        renderizarTabela(dadosFiliais);
        renderizarGrafico(dadosFiliais)
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