import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import listRoutes from './routes/listRoutes.js';
import listItemRoutes from './routes/listItemRoutes.js';
import listNoteRoutes from './routes/listNoteRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

let specs;
try {
    specs = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf8'));
} catch (error) {
    console.log('Failed to load OpenAPI specification', error);
    process.exit(1);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/list', listRoutes);
app.use('/api/listitem', listItemRoutes);
app.use('/api/listnote', listNoteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || 'Internal Server Error',
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
