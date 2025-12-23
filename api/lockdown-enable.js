import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  // Secret header check
  const SECRET = process.env.LOCKDOWN_SECRET;
  console.log(SECRET)
  if (req.headers['x-lockdown-secret'] !== SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
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

