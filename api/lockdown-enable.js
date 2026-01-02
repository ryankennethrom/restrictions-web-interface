import { put } from '@vercel/blob';
import { verifySecret } from './auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const secret = req.query.secret || req.headers["x-api-secret"] || req.headers["x-lockdown-secret"];

  if (!(await verifySecret(secret))) {
      return res.status(401).json({ error: "Unauthorized: invalid password" });
    }

  
  try {
    await put('lockdown.json',JSON.stringify({
		    lockdown_active: true,
		    updated_at: new Date().toISOString()}, null, 2),{
      access: 'public',
      contentType: "application/json",
      allowOverwrite: true,
      addRandomSuffix: false
    });

    res.status(200).json({ lockdown_active: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enable lockdown', message: err.message });
  }
}

