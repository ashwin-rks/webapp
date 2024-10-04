import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

// routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dataRoutes from './routes/dataRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
);


// paths
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/data', dataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});