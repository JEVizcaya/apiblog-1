const db = require('../config/db');

exports.getAllPosts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT posts.id, posts.titulo, posts.descripcion, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener posts' });
  }
};

exports.getPostsByUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query('SELECT * FROM posts WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener posts del usuario' });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT posts.id, posts.titulo, posts.descripcion, users.username 
       FROM posts 
       JOIN users ON posts.user_id = users.id 
       WHERE posts.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el post' });
  }
};

exports.createPost = async (req, res) => {
  const { titulo, descripcion } = req.body;
  const userId = req.user.id;
  try {
    const result = await db.query(
      'INSERT INTO posts (titulo, descripcion, user_id) VALUES ($1, $2, $3) RETURNING id',
      [titulo, descripcion, userId]
    );
    res.json({ message: 'Post creado', postId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear post' });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  try {
    const result = await db.query(
      'UPDATE posts SET titulo = $1, descripcion = $2 WHERE id = $3',
      [titulo, descripcion, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Post no encontrado o error al actualizar' });
    res.json({ message: 'Post actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el post' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM posts WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Post no encontrado' });
    res.json({ message: 'Post eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
};
