import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import userRoutes from './routes/userRoutes.js'; 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

//Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

//Health Check
app.get('/health', (req, res) => {
    res.send('Weavy Proxy is running!');
});

//User Routes
app.use('/api/users', userRoutes);

//Not Found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});