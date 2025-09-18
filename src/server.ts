import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
}));

// 注意：Better Auth 的路由要在 express.json() 之前挂载
app.use("/api/auth", toNodeHandler(auth));
app.use(express.json());

app.get("/healthz", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Auth server on :${PORT}`));

