if (localStorage.getItem('usuarioPerfil') !== 'bibliotecario') {
    window.location.href = '/';
}

function logout() {
    localStorage.clear();
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
    carregarEmprestimos();
});

document.getElementById('livro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('livro-id').value;
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const ano_publicacao = document.getElementById('ano_publicacao').value;
    const quantidade_disponivel = document.getElementById('quantidade_disponivel').value;

    const dados = { titulo, autor, ano_publicacao, quantidade_disponivel };
    let url = '/api/livros';
    let method = 'POST';

    if (id) {
        url = `/api/livros/${id}`;
        method = 'PUT';
    }

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (res.ok) {
        document.getElementById('livro-form').reset();
        document.getElementById('livro-id').value = '';
        document.getElementById('btn-submit-livro').innerText = 'Salvar Livro';
        carregarLivros();
    }
});

async function carregarLivros() {
    const res = await fetch('/api/livros');
    const livros = await res.json();
    const tbody = document.getElementById('tabela-livros');
    tbody.innerHTML = '';

    livros.forEach(livro => {
        tbody.innerHTML += `
            <tr>
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.ano_publicacao}</td>
                <td>${livro.quantidade_disponivel}</td>
                <td>
                    <button class="btn-primary" onclick="prepararEdicao(${livro.id}, '${livro.titulo}', '${livro.autor}', ${livro.ano_publicacao}, ${livro.quantidade_disponivel})">Editar</button>
                    <button class="btn-danger" onclick="excluirLivro(${livro.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function prepararEdicao(id, titulo, autor, ano, qtd) {
    document.getElementById('livro-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('autor').value = autor;
    document.getElementById('ano_publicacao').value = ano;
    document.getElementById('quantidade_disponivel').value = qtd;
    document.getElementById('btn-submit-livro').innerText = 'Atualizar Livro';
}

async function excluirLivro(id) {
    if (confirm('Tem certeza que deseja deletar este livro?')) {
        await fetch(`/api/livros/${id}`, { method: 'DELETE' });
        carregarLivros();
    }
}

async function carregarEmprestimos() {
    const res = await fetch('/api/emprestimos');
    const emprestimos = await res.json();
    const tbody = document.getElementById('tabela-emprestimos');
    tbody.innerHTML = '';

    emprestimos.forEach(emp => {
        const botaoDevolucao = emp.status === 'Ativo' 
            ? `<button class="btn-success" onclick="devolverLivro(${emp.id})">Marcar como Devolvido</button>` 
            : `Concluído`;

        tbody.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.leitor_id}</td>
                <td>${emp.livro_id}</td>
                <td>${new Date(emp.data_emprestimo).toLocaleDateString()}</td>
                <td>${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</td>
                <td><strong>${emp.status}</strong></td>
                <td>${botaoDevolucao}</td>
            </tr>
        `;
    });
}

async function devolverLivro(id) {
    const res = await fetch(`/api/emprestimos/devolver/${id}`, { method: 'PUT' });
    if (res.ok) {
        alert('Devolução registrada e estoque atualizado!');
        carregarLivros();
        carregarEmprestimos();
    }
}
