import { analyzeTraceback } from '../../lib/engine';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { traceback, files } = req.body;

  if (!traceback || !files || !Array.isArray(files)) {
    return res.status(400).json({ error: 'Missing traceback or project files.' });
  }

  try {
    const analysis = await analyzeTraceback(traceback, files);
    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Errorly Engine Error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze traceback.', 
      details: error.message 
    });
  }
}
