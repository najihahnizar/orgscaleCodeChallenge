import { Router } from "express";
import {
  createItem,
  listItems,
  getItemById,
  updateItem,
  deleteItem
} from "../controllers/items.controllers";

const router = Router();

router.post("/", createItem);
router.get("/", listItems);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
