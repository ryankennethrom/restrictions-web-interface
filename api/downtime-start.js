import { put } from "@vercel/blob";

const TIMEZONE = "America/Edmonton";
// Use LOCKDOWN_SECRET from environment variables
const LOCKDOWN_SECRET = process.env.LOCKDOWN_SECRET;

export default async function handler(req, res) {
  try {
    // Validate secret
    const secret = req.query.secret || req.headers["x-api-secret"];
    if (!secret || secret !== LOCKDOWN_SECRET) {
      return res.status(401).json({ error: "Unauthorized: invalid secret" });
    }

    const hours = parseInt(req.query.hours || "0", 10);

    const utcDate = new Date();
    utcDate.setHours(utcDate.getHours() + hours);

    // Format local time string
    const localTime = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(utcDate);

    const payload = {
      downtime_start_utc: utcDate.toISOString(),
      downtime_start_local: localTime,
      timezone: TIMEZONE,
      hours_added: hours,
    };

    await put("downtime.json", JSON.stringify(payload, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    res.status(200).json(payload);
  } catch (err) {
    res.status(500).json({
      error: "Failed to save downtime",
      message: err.message,
    });
  }
}


