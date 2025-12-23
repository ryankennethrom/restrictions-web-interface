export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://api.github.com/repos/ryankennethrom/restrictions-web-interface/commits/main'
    );
    const data = await response.json();
    const commitSHA = data.sha;

    res.status(200).json({ repoHash: commitSHA });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
