import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).send("Ok");
});

app.listen(PORT, () => {
    console.log(`Api gateway running at http://localhost:${PORT}`);
});