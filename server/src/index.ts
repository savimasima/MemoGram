import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./env";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "memogram-api" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(ENV.PORT, () => {
  console.log(`Memogram API running on http://localhost:${ENV.PORT}`);
});