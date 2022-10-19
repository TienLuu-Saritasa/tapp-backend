import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/notes', (req: Request, res: Response) => {
  res.send('Notes');
});

export default router;
