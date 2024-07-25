
import express from 'express'; // Import express
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;


/* Need to run npm i , npm i cors , npm i express , npm i pg , npm i -D dotenv   */

const PORT = process.env.PORT || 8000;

const app = express();
const pool = new Pool({ connectionString: process.env.PG_URI });

app.use(express.json());
app.use(cors());


// Define a GET route to fetch data from the database
app.get('/posts', async (req, res) => {
  try {
    const client = await pool.connect(); 
    const result = await pool.query('SELECT * FROM posts'); 

    const posts = result.rows; 
    client.release(); 
    res.json(posts); 
  } catch (err) {

    console.error("Error executing query", err.stack);
    res.status(500).send("Error connecting to database");
  }
});


// Define a GET route to fetch a single post by ID
app.get('/posts/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const client = await pool.connect();
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// add a new Post :)
app.post('/posts', async (req, res) => {
  const { title, author, content, cover } = req.body;

  if (!title || !author || !content || !cover) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, author, content, cover) VALUES ($1, $2, $3, $4) RETURNING *;',
      [title, author, content, cover]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Posts', error.stack);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// update a post
app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, content, cover } = req.body;
    if (!title || !author || !content) throw new Error('Missing data');

    const { rows } = await pool.query(
      'UPDATE posts SET title = $1, author = $2, content = $3, cover = $4 WHERE id = $5 RETURNING *;',
      [title, author, content, cover, id]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Posts', error.stack);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
});



app.delete("/posts/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    client.release();
    if (result.rows.length > 0) {
      res.json({
        message: "Post deleted successfully",
        deletedPost: result.rows[0],
      });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.error("Error deleting post", err.stack);
    res.status(500).send("Error deleting post");
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
