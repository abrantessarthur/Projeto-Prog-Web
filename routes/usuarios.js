const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { nome, email, senha, perfil } = req.body;

    db.query(
        'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
        [nome, email, senha, perfil],
        (err, result) => {
            if (err) return res.status(500).send(err);

            res.status(201).json({
                id: result.insertId,
                nome,
                email,
                perfil
            });
        }
    );
});


router.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


router.put('/:id', (req, res) => {
    const { nome, email } = req.body;
    const { id } = req.params;

    db.query(
        'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
        [nome, email, id],
        (err) => {
            if (err) return res.status(500).send(err);

            res.json({ id, nome, email });
        }
    );
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM usuarios WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).send(err);

            res.sendStatus(204);
        }
    );
});

module.exports = router;