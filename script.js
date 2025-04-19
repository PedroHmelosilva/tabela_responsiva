tabela = document.getElementById('tabela');

fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(filial => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <th scope="row">${filial.id}</th>
                <td>${filial.nome}</td>
                <td>${filial.status}</td>
                <td>${filial.dataUltimaVenda}</td>
            `;

            tabela.appendChild(linha);
        });
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));

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