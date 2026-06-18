const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const db = require('./db');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

const usuariosRoutes = require('./routes/usuarios');
const livrosRoutes = require('./routes/livros');
const emprestimosRoutes = require('./routes/emprestimos');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/livros', livrosRoutes);
app.use('/api/emprestimos', emprestimosRoutes);

app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    db.query(
        'SELECT id, nome, email, perfil FROM usuarios WHERE email = ? AND senha = ?',
        [email, senha],
        (err, results) => {
            if (err) return res.status(500).send(err);
            if (results.length === 0) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }
            res.json(results[0]);
        }
    );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
