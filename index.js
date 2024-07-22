import express from 'express'; // Import express
import cors from 'cors';
import pg from 'pg';

/* Need to run npm i , npm i cors , npm i express , npm i pg , npm i -D dotenv   */

const PORT = process.env.PORT || 3000; // Declare a port variable

const app = express(); // Creat your app object

app.use(express.json());
app.use(cors());

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

app.put('/posts/:id', (req, res) =>
  res.json({ message: 'Update an existing post by id' })
);

app.delete('/posts/:id', (req, res) =>
  res.json({ message: 'DELETE a post by id' })
);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
