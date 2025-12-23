export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://pfpczqewysgauczj.public.blob.vercel-storage.com/downtime.json"
        );

        if (!response.ok) {
            throw new Error("Not found");
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch {
        res.status(404).json({ error: "No downtime set yet" });
    }
}
