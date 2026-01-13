import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.json({
    message: "hi",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`[SERVER] running on http://localhost:${PORT}`);
});
