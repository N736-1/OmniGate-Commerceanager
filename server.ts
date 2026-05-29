import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // PayBridg Gateway Simulation Endpoint
  app.post("/api/gateway/process", (req, res) => {
    const { amount, currency, method, identifier } = req.body;
    // Log intent: this is where actual integrations would connect
    console.log(`Processing ${amount} ${currency} using ${method} for ${identifier}`);
    
    // Simulate approval
    res.json({
        transactionId: `TXN_${Math.random().toString(36).substring(7).toUpperCase()}`,
        status: 'approved',
        message: 'Transaction processed successfullly.'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
