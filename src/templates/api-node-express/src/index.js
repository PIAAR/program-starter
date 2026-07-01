import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: '{{PROJECT_NAME}}' });
});

app.listen(port, () => {
  console.log(`{{PROJECT_NAME}} listening on http://localhost:${port}`);
});
