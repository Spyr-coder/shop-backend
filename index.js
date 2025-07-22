// index.js
const express = require("express");
const app = express();

// Use the dynamic port from environment or fallback to 3000 for local dev
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
