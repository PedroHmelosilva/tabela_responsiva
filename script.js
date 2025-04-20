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

        //Tira o "Filial" de cada item da coluna Nome
        function nomeSemFilial(nome) {
            return nome.replace(/^filial\s*/i, '');
        }
        
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
          <td>${nomeSemFilial(filial.nome)}</td>
          <td>
            <div class="status-cell">
              <div
                class="status-circle"
                style="background-color: ${corStatus(filial.status)};"
              ></div>
            </div>
          </td>
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

// Função que muda a cor do status de acordo com o sua meta
function corStatus(status) {
    status = status.toLowerCase();
    if (status.includes('acima da meta')) return '#959b7b';
    if (status.includes('na meta')) return '#325a6d';
    if (status.includes('abaixo da meta')) return '#921a28';
    return '#6c757d';
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
    const statusCores = dados.map(filial => corStatus(filial.status));

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
                backgroundColor: statusCores,
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

function atualizarBarraProgresso(dados) {
    const total = dados.length;
    const acima = dados.filter(f => f.status.toLowerCase().includes('acima da meta')).length;
    const naMeta = dados.filter(f => f.status.toLowerCase().includes('na meta')).length;
    const abaixo = dados.filter(f => f.status.toLowerCase().includes('abaixo da meta')).length;

    // Percentuais
    const pctAcima = Math.round((acima / total) * 100);
    const pctNaMeta = Math.round((naMeta / total) * 100);
    const pctAbaixo = Math.round((abaixo / total) * 100);

    // Coloca os percentuais para atualizar o tamanho da barra
    document.getElementById('acimaMeta').style.width = `${pctAcima}%`;
    document.getElementById('naMeta').style.width = `${pctNaMeta}%`;
    document.getElementById('abaixoMeta').style.width = `${pctAbaixo}%`;

    // Texto dentro da barra
    document.getElementById('acimaMeta').textContent = `${pctAcima}%`;
    document.getElementById('naMeta').textContent = `${pctNaMeta}%`;
    document.getElementById('abaixoMeta').textContent = `${pctAbaixo}%`;
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
        
        atualizarBarraProgresso(dadosFiliais);
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));

//Função de pesquisa
inputPesquisa.addEventListener('input', () => {
    const termo = inputPesquisa.value.toLowerCase();

    const resultados = dadosFiliais.filter(filial =>
        filial.nome.toLowerCase().includes(termo) ||
        filial.id.toString().includes(termo)
    );

    renderizarTabela(resultados);
    renderizarGrafico(resultados);
    atualizarBarraProgresso(resultados);

    const totalFiltrado = calcularTotalVendas(resultados);
    totalVendasElemento.innerText = `R$ ${totalFiltrado.toLocaleString('pt-BR')}`;
});