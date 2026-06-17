document.getElementById('registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('reg-nome').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-senha').value;
    const perfil = document.getElementById('reg-perfil').value;

    // 🟢 Linhas do Node removidas daqui. O fetch abaixo já faz todo o trabalho!

    try {
        const res = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, perfil })
        });

        if (res.ok) {
            alert('Usuário registrado com sucesso! Agora faça o login.');
            document.getElementById('registro-form').reset();
        } else {
            alert('Erro ao registrar usuário.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});

// Lógica de Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const erroDiv = document.getElementById('login-erro');
    erroDiv.innerText = '';

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        if (res.ok) {
            const usuario = await res.json();
            localStorage.setItem('usuarioId', usuario.id);
            localStorage.setItem('usuarioPerfil', usuario.perfil);

            if (usuario.perfil === 'bibliotecario') {
                window.location.href = '/views/bibliotecario.html';
            } else {
                window.location.href = '/views/leitor.html';
            }
        } else {
            const errData = await res.json();
            erroDiv.innerText = errData.error || 'Credenciais inválidas.';
        }
    } catch (error) {
        erroDiv.innerText = 'Erro ao conectar com o servidor.';
    }
});