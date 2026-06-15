// formulário usuário
const formUser = document.getElementById('user-form');
// formulário livro
const formLivro = document.getElementById('livro-form');
const usuarioList = document.getElementById('usuario-list');
const livroList = document.getElementById('livro-list');
carregarUsuarios();
carregarLivros();
// cadastro do usuari
formUser.addEventListener('submit', e => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    const email = document.getElementById('email').value;
    const perfil = document.getElementById('perfil').value;

    cadastrarUsuario(nome, email, senha, perfil);
});

formLivro.addEventListener('submit', e => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const ano_publicacao = document.getElementById('ano_publicacao').value;
    const quantidade_disponivel = document.getElementById('quantidade_disponivel').value;

    cadastrarLivro(titulo, autor, ano_publicacao, quantidade_disponivel);
});

function cadastrarUsuario(nome, email, senha, perfil) {
    fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, perfil })
    })
    .then(() => {
        formUser.reset();
        carregarUsuarios();
    })
    .catch(err => console.error(err));
}

function cadastrarLivro(titulo, autor, ano_publicacao, quantidade_disponivel) {
    fetch('/api/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor, ano_publicacao, quantidade_disponivel })
    })
    .then(() => {
        formLivro.reset();
        carregarLivros();
    })
    .catch(err => console.error(err));
}

function carregarUsuarios() {
    fetch('/api/usuarios')
        .then(res => res.json())
        .then(data => {

            usuarioList.innerHTML = '';

            data.forEach(usuario => {
                const li = document.createElement('li');

                li.innerHTML = `
                    ${usuario.nome} 
                    (${usuario.email}) 
                    (${usuario.perfil})

                    <button onclick="atualizarUsuario(${usuario.id})">Editar</button>
                    <button onclick="excluirUsuario(${usuario.id})">Excluir</button>
                `;

                usuarioList.appendChild(li);
            });

        })
    
}

function carregarLivros() {
    fetch('/api/livros')
        .then(res => res.json())
        .then(data => {

            livroList.innerHTML = '';

            data.forEach(livro => {
                const li = document.createElement('li');

                li.innerHTML = `
                    ${livro.titulo} 
                    (${livro.autor}) 
                    (${livro.ano_publicacao})
                    (${livro.quantidade_disponivel})

                    <button onclick="atualizarLivro(${livro.id})">Editar</button>
                    <button onclick="excluirLivro(${livro.id})">Excluir</button>
                `;

                livroList.appendChild(li);
            });

        })
    
}

function excluirUsuario(id) {
    const confirmacao = confirm('Tem certeza?');

    if (!confirmacao) {
        return;
    };

    fetch(`/api/usuarios/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        carregarUsuarios();
    });
};

function excluirLivro(id) {
    const confirmacao = confirm('Tem certeza?');

    if (!confirmacao) {
        return;
    };

    fetch(`/api/livros/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        carregarLivros();
    });
};
