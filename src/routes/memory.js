import express from 'express';
import { getPromptLogs } from '../services/promptLogger.js';

export const memoryRouter = express.Router();

// Get all prompt logs
memoryRouter.get('/logs', async (req, res) => {
  try {
    const logs = await getPromptLogs();
    res.json({
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get logs count
memoryRouter.get('/logs/count', async (req, res) => {
  try {
    const logs = await getPromptLogs();
    res.json({ count: logs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default memoryRouter;
