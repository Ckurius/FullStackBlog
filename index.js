import express from 'express'; // Import express
import cors from 'cors';
import pg from 'pg';

/* Need to run npm i , npm i cors , npm i express , npm i pg , npm i -D dotenv   */

const PORT = process.env.PORT || 3000; // Declare a port variable

const app = express(); // Creat your app object

app.use(express.json());
app.use(cors());

// Create a SQL pool object to connect to the database
const pool = new pg.Pool({
  connectionString: process.env.PG_URI,
});



// Define a GET route to fetch data from the database
app.get('/posts', async (req, res) => {
  try {
    const client = await pool.connect();                    // client will be the connection to the database
    const result = await pool.query('SELECT * FROM posts'); // this is the query to the database
    const posts = result.rows;                              // This is the result of the query returned from the database in rows
    client.release();                                       // this means that the connection is released /ended
    res.json(posts);                                        //  res is the response to the client and we are sending the posts
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error connecting to database');
  }
});

// Define a GET route to fetch a single post by ID
app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;                                      // this is the id that is passed in the url
  try {
    const client = await pool.connect();
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/posts', (req, res) => {
  res.json({ message: 'Create a new post' });
});

app.put('/posts/:id', (req, res) =>
  res.json({ message: 'Update an existing post by id' })
);

app.delete('/posts/:id', (req, res) =>
  res.json({ message: 'DELETE a post by id' })
);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
