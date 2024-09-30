import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
);

// routes
import authRoutes from './routes/authRoutes.js';

// paths
app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});