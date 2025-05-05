const db = require('../config/db');

exports.getAllPosts = (req, res) => {
  db.query(
    `SELECT posts.id, posts.titulo, posts.descripcion, users.username 
     FROM posts 
     JOIN users ON posts.user_id = users.id 
     ORDER BY posts.id DESC`,
    (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener posts' });
    res.json(results);
  });
};

exports.getPostsByUser = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM posts WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener posts del usuario' });
    res.json(results);
  });
};

exports.getPostById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Post no encontrado' });
    res.json(results[0]);
  });
};

exports.createPost = (req, res) => {
  const { titulo, descripcion } = req.body;
  const userId = req.user.id;

  db.query('INSERT INTO posts (titulo, descripcion, user_id) VALUES (?, ?, ?)', [titulo, descripcion, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear post' });
    }
    res.json({ message: 'Post creado', postId: result.insertId });
  });
};
exports.updatePost = (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  db.query(
    'UPDATE posts SET titulo = ?, descripcion = ? WHERE id = ?',
    [titulo, descripcion, id],
    (err, result) => {
      if (err || result.affectedRows === 0) return res.status(404).json({ error: 'Post no encontrado o error al actualizar' });
      res.json({ message: 'Post actualizado' });
    }
  );
};
exports.deletePost = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
    if (err || result.affectedRows === 0) return res.status(404).json({ error: 'Post no encontrado' });
    res.json({ message: 'Post eliminado' });
  });
}