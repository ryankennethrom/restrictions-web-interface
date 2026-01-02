import { put } from '@vercel/blob';
import { verifySecret } from './auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  
  // Validate secret
  const secret = req.query.secret || req.headers["x-api-secret"] || req.headers["x-lockdown-secret"];

  if (!(await verifySecret(secret))) {
      return res.status(401).json({ error: "Unauthorized: invalid password" });
    }

  try {
    await put(
      'lockdown.json', // blob filename
      JSON.stringify(
        {
          lockdown_active: false,
          updated_at: new Date().toISOString()
        },
        null,
        2
      ),
      {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true,
        addRandomSuffix: false
      }
    );

    res.status(200).json({ lockdown_active: false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to disable lockdown', message: err.message });
  }
}
