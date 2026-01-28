import { Request, Response } from "express";
import { db } from "../database";

// Create
export const createItem = (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const stmt = db.prepare(
    "INSERT INTO items (name, description, createdAt) VALUES (?, ?, ?)"
  );

  const result = stmt.run(name, description, new Date().toISOString());

  res.status(201).json({ id: result.lastInsertRowid });
};

// List with basic filters
export const listItems = (req: Request, res: Response) => {
  const { name } = req.query;

  let query = "SELECT * FROM items";
  const params: any[] = [];

  if (name) {
    query += " WHERE name LIKE ?";
    params.push(`%${name}%`);
  }

  const items = db.prepare(query).all(...params);
  res.json(items);
};

// Get by ID
export const getItemById = (req: Request, res: Response) => {
  const item = db
    .prepare("SELECT * FROM items WHERE id = ?")
    .get(req.params.id);

  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json(item);
};

// Update
export const updateItem = (req: Request, res: Response) => {
  const { name, description } = req.body;

  const stmt = db.prepare(
    "UPDATE items SET name = ?, description = ? WHERE id = ?"
  );

  const result = stmt.run(name, description, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ message: "Item updated" });
};

// Delete
export const deleteItem = (req: Request, res: Response) => {
  const result = db
    .prepare("DELETE FROM items WHERE id = ?")
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ message: "Item deleted" });
};
