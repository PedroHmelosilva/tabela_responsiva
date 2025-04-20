//Função que renderiza a tabela
const tabela = document.getElementById('tabela');
const inputPesquisa = document.getElementById('pesquisa');
const ctx = document.getElementById('grafico').getContext('2d');
let dadosFiliais = [];

function renderizarTabela(dados) {
    tabela.innerHTML = '';
    dados.forEach(filial => {
        const modalId = `modalFilial-${filial.id}`;
        
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
                </div>
              </div>
            </div>
        `;
        document.body.appendChild(modalDiv.firstElementChild);
    });
}

const totalVendasElemento = document.getElementById('totalVendas');

// Total de vendas
function calcularTotalVendas(dados) {
    let total = 0;
    dados.forEach(filial => {
        total += filial.vendas;
    });
    return total;
}

let graficoAtual = null;

function renderizarGrafico(dados) {
    const nomes = dados.map(filial => filial.nome);
    const vendas = dados.map(filial => filial.vendas);

    // Se tiver outro gráfico, exclui e sobreescreve um novo
    if (graficoAtual) {
        graficoAtual.destroy(); 
    }

    graficoAtual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Vendas (mil R$)',
                data: vendas,
                backgroundColor: ['#f5e003', '#d1a33c', '#e5b611'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

//Vizualização dos dados da tabela
fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        dadosFiliais = data;
        renderizarTabela(dadosFiliais);
        renderizarGrafico(dadosFiliais);
        
        const total = calcularTotalVendas(dadosFiliais);
        totalVendasElemento.innerText = `R$ ${total.toLocaleString('pt-BR')}`;
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

    renderizarTabela(resultados);
    renderizarGrafico(resultados);
});