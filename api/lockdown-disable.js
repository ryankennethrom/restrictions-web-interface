import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const SECRET = process.env.LOCKDOWN_SECRET;
  if (req.headers['x-lockdown-secret'] !== SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
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
