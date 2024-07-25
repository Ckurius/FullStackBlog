import express from "express"; // Import express
import cors from "cors";
import pg from "pg";

/* Need to run npm i , npm i cors , npm i express , npm i pg , npm i -D dotenv   */

const PORT = process.env.PORT || 3000; // Declare a port variable

const app = express(); // Creat your app object

app.use(express.json());
app.use(cors());
const pool = new pg.Pool({
  connectionString: process.env.PG_URI,
});
//const posts = [
//{ id: 1, title: 'Post 1', content: 'testcontent1', cover: 'img1' },
//{ id: 2, title: 'Post 2', content: 'testcontent2', cover: 'img2' },
//{ id: 3, title: 'Post 3', content: 'testcontent3', cover: 'img3' },
// ]; // Simple array to represent data
//app.get('/posts', (req, res) =>
//res.json({ message: 'Retrieve all posts', posts })
//);
app.get("/posts", async (req, res) => {
  try {
    const client = await pool.connect(); // client will be the connection to the database
    const result = await pool.query("SELECT * FROM posts"); // this is the query to the database
    const posts = result.rows; // This is the result of the query returned from the database in rows
    client.release(); // this means that the connection is released /ended
    res.json(posts); //  res is the response to the client and we are sending the posts
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Error connecting to database");
  }
});
app.get("/posts/:id", (req, res) => {
  res.json({ message: "Retrieve a single post by ID" });
});

app.post("/posts", (req, res) => {
  res.json({ message: "Create a new post" });
});

app.put("/posts/:id", (req, res) =>
  res.json({ message: "Update an existing post by id" })
);

//app.delete("/posts/:id", (req, res) =>
  //res.json({ message: "DELETE a post by id" })

app.delete("/posts/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("DELETE FROM posts WHERE id = $1 RETURNING *", [req.params.id]);
    client.release();
    if (result.rows.length > 0) {
      res.json({ message: "Post deleted successfully", deletedPost: result.rows[0] });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.error("Error deleting post", err.stack);
    res.status(500).send("Error deleting post");
  }
});

);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
