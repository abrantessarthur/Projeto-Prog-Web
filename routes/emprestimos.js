const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { livro_id, leitor_id, data_emprestimo, data_devolucao_prevista } = req.body;

    db.query(
        'SELECT quantidade_disponivel FROM livros WHERE id = ?',
        [livro_id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (!result.length) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            if (result[0].quantidade_disponivel <= 0) {
                return res.status(400).json({ error: 'Livro indisponível' });
            }

            db.query(
                `INSERT INTO emprestimos 
                (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status)
                VALUES (?, ?, ?, ?, 'Ativo')`,
                [livro_id, leitor_id, data_emprestimo, data_devolucao_prevista],
                (err, resultInsert) => {
                    if (err) return res.status(500).send(err);

                    db.query(
                        'UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?',
                        [livro_id]
                    );

                    res.status(201).json({
                        id: resultInsert.insertId,
                        livro_id,
                        leitor_id,
                        data_emprestimo,
                        data_devolucao_prevista,
                        status: 'Ativo'
                    });
                }
            );
        }
    );
});

router.get('/', (req, res) => {
    db.query('SELECT * FROM emprestimos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

router.put('/devolver/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT livro_id FROM emprestimos WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (!result.length) {
                return res.status(404).json({ error: 'Empréstimo não encontrado' });
            }

            const livro_id = result[0].livro_id;

            db.query(
                `UPDATE emprestimos 
                 SET status = 'Devolvido', data_devolucao_real = NOW()
                 WHERE id = ?`,
                [id],
                (err2) => {
                    if (err2) return res.status(500).send(err2);

                    db.query(
                        `UPDATE livros 
                         SET quantidade_disponivel = quantidade_disponivel + 1
                         WHERE id = ?`,
                        [livro_id]
                    );

                    res.json({ message: 'Livro devolvido com sucesso' });
                }
            );
        }
    );
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM emprestimos WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.sendStatus(204);
        }
    );
});

module.exports = router;