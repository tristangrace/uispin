import { Router, Request, Response } from "express";
import { getDesigns, getDesignById } from "../services/designStorage.js";

export const designsRouter = Router();

designsRouter.get("/designs", async (_req: Request, res: Response) => {
  try {
    const designs = await getDesigns();
    res.json({ designs });
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ error: "Failed to fetch designs" });
  }
});

designsRouter.get("/designs/:id", async (req: Request, res: Response) => {
  try {
    const design = await getDesignById(req.params.id);
    if (!design) {
      res.status(404).json({ error: "Design not found" });
      return;
    }
    res.json(design);
  } catch (error) {
    console.error("Error fetching design:", error);
    res.status(500).json({ error: "Failed to fetch design" });
  }
});
