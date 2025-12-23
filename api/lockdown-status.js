export default async function handler(req, res) {
  try {
    const blobUrl = 'https://pfpczqewysgauczj.public.blob.vercel-storage.com/lockdown.json';

    const response = await fetch(blobUrl);
    if (!response.ok) throw new Error('Lockdown status not set yet');

    const data = await response.json();
    res.status(200).json(data);
  } catch {
    // Default if blob is missing or unreadable
    res.status(200).json({ lockdown_active: false, updated_at: null });
  }
}
