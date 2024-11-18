import express from 'express';
import cors from 'cors';
import galleryRouter from './routes/gallery'; // Import your gallery.ts

const app = express();
app.use(cors()); // Enable CORS to allow requests from frontend

// Use the paginated gallery route
app.use('/api/images', galleryRouter);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
