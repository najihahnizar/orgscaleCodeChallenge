import express from "express";
import itemsRoutes from "./routes/items.routes";

const app = express();

app.use(express.json());

app.use("/items", itemsRoutes);

export default app;
