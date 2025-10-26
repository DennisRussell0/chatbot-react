import express from "express";
import cors from "cors";
import sql from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const threads = await sql`
      SELECT id, title, created_at
      FROM threads
      ORDER BY created_at DESC
    `;

    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);

    res.status(500).json({
      error: "Failed to fetch threads from database",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
