import express from "express"; // Import express
import cors from "cors";
import pg from "pg";
const { Pool } = pg;

import bodyParser from "body-parser";

/* Need to run npm i , npm i cors , npm i express , npm i pg , npm i -D dotenv   */

const PORT = process.env.PORT || 8000; 

const app = express(); 
const pool = new Pool({ connectionString: process.env.PG_URI });

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const posts = [
  { id: 1, title: 'Post 1', content: 'testcontent1', cover: 'img1' },
  { id: 2, title: 'Post 2', content: 'testcontent2', cover: 'img2' },
  { id: 3, title: 'Post 3', content: 'testcontent3', cover: 'img3' },
]; // Simple array to represent data

app.get('/posts', (req, res) =>
  res.json({ message: 'Retrieve all posts', posts })
);

app.get('/posts/:id', (req, res) => {
  res.json({ message: 'Retrieve a single post by ID' });
});

app.post('/posts', (req, res) => {
  res.json({ message: 'Create a new post' });
});

// update a post
app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, content, cover } = req.body;
    if (!title || !author || !content) throw new Error("Missing data");

    const { rows } = await pool.query(
      "UPDATE posts SET title = $1, author = $2, content = $3, cover = $4 WHERE id = $5 RETURNING *;",
      [title, author, content, cover, id]
    );
    return res.json(rows);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Posts", error.stack);
    return res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.delete('/posts/:id', (req, res) =>
  res.json({ message: 'DELETE a post by id' })
);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
