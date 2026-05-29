import express from 'express';
import { PrismaClient } from '@prisma/client';
import { analyzeUrl } from '../utils/analyzer.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/scan', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Valid URL string is required' });
  }

  try {
    // Basic sanitization
    const sanitizedUrl = url.trim();

    // Analyze
    const analysisResult = await analyzeUrl(sanitizedUrl);

    // Save history
    const historyEntry = await prisma.scanHistory.create({
      data: {
        url: sanitizedUrl,
        riskLevel: analysisResult.risk_level,
        confidenceScore: analysisResult.confidence_score,
        triggeredRules: JSON.stringify(analysisResult.triggered_rules),
      },
    });

    res.status(200).json({
      id: historyEntry.id,
      url: historyEntry.url,
      ...analysisResult,
    });
  } catch (error) {
    console.error('Error scanning URL:', error);
    res.status(500).json({ error: 'Failed to process URL' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await prisma.scanHistory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // get last 20 scans
    });
    
    // Parse the JSON string back into an array for the frontend
    const parsedHistory = history.map(item => ({
      ...item,
      triggeredRules: item.triggeredRules ? JSON.parse(item.triggeredRules) : []
    }));
    
    res.status(200).json(parsedHistory);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
