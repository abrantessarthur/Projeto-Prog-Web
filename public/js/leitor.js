const leitorId = localStorage.getItem('usuarioId');

if (!leitorId || localStorage.getItem('usuarioPerfil') !== 'leitor') {
    window.location.href = '/';
}

function logout() {
    localStorage.clear();
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCatalogo();
    carregarMeusEmprestimos();
});

async function carregarCatalogo() {
    const res = await fetch('/api/livros');
    const livros = await res.json();
    const tbody = document.getElementById('catalogo-livros');
    tbody.innerHTML = '';

    livros.forEach(livro => {
        const indisponivel = livro.quantidade_disponivel <= 0;
        const botao = indisponivel 
            ? `<button class="disabled" disabled>Esgotado</button>`
            : `<button class="btn-info" onclick="solicitarEmprestimo(${livro.id})">Solicitar Empréstimo</button>`;

        tbody.innerHTML += `
            <tr>
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.ano_publicacao}</td>
                <td>${livro.quantidade_disponivel}</td>
                <td>${botao}</td>
            </tr>
        `;
    });
}

async function solicitarEmprestimo(livroId) {
    const hoje = new Date().toISOString().split('T')[0];
    
    const dataDevolucao = new Date();
    dataDevolucao.setDate(dataDevolucao.getDate() + 14);
    const prevista = dataDevolucao.toISOString().split('T')[0];

    const res = await fetch('/api/emprestimos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            livro_id: livroId,
            leitor_id: parseInt(leitorId),
            data_emprestimo: hoje,
            data_devolucao_prevista: prevista
        })
    });

    if (res.ok) {
        alert('Empréstimo realizado com sucesso!');
        carregarCatalogo();
        carregarMeusEmprestimos();
    } else {
        const err = await res.json();
        alert('Erro: ' + err.error);
    }
}

async function carregarMeusEmprestimos() {
    const res = await fetch('/api/emprestimos');
    const todosEmprestimos = await res.json();
    const tbody = document.getElementById('meus-emprestimos');
    tbody.innerHTML = '';

    const emprestimosDoLeitor = todosEmprestimos.filter(emp => emp.leitor_id == leitorId);

    emprestimosDoLeitor.forEach(emp => {
        tbody.innerHTML += `
            <tr>
                <td>${emp.livro_id}</td>
                <td>${new Date(emp.data_emprestimo).toLocaleDateString()}</td>
                <td>${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</td>
                <td><strong>${emp.status}</strong></td>
            </tr>
        `;
    });
}
