import express from "express";
import { createItem, getAllItems, getFilteredItems } from "../controller/serviceController.js";

const serviceRouter = express.Router();

serviceRouter.post("/additem",createItem);
serviceRouter.get("/getitem",getAllItems);
serviceRouter.get('/filtereditems',getFilteredItems);

export default serviceRouter;
