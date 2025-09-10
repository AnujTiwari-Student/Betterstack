import express from 'express';
import v1Router from './routes/v1';

const app = express();

app.use(express.json());

app.use('/api/v1', v1Router);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});