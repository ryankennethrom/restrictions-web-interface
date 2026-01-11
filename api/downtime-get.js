import { decrypt } from "./cryptoBox.js";

export default async function handler(req, res) {
    try {
	const secret = req.query.secret || req.headers["x-api-secret"];
    	
	if (!secret) {
      		return res.status(401).json({ error: "Missing secret" });
    	}

        const response = await fetch(
            "https://pfpczqewysgauczj.public.blob.vercel-storage.com/downtime.json"
        );

        if (!response.ok) {
            throw new Error("Not found");
        }
	
	// Read encrypted text, NOT json
	const encrypted = await response.text();

    	// Decrypt
    	const plaintext = decrypt(encrypted, secret);
    	const data = JSON.parse(plaintext);

        res.status(200).json(data);
    } catch {
        res.status(404).json({ error: "No downtime set yet" });
    }
}
