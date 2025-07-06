import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    /* eslint-disable no-console */
    console.log(`🚀  API ready on http://localhost:${PORT}`);
});
