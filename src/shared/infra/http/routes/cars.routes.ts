import { Router } from "express";
import multer from "multer";

import uploadConfig from "../../../../config/upload";
import { CreateCarController } from "../../../../modules/cars/useCases/createCar/CreateCarController";
import { CreateCarSpecficiationController } from "../../../../modules/cars/useCases/createCarSpecification/CreateCarSpecificationController";
import { ListAvailableCarsController } from "../../../../modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { UploadCarImageController } from "../../../../modules/cars/useCases/uploadCarImage/UploadCarImageController";
import { ensureAdmin } from "../middleware/ensureAdmin";
import { ensureAuthenticated } from "../middleware/ensureAuthenticate";

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecficiationController = new CreateCarSpecficiationController();
const uploadCarImageController = new UploadCarImageController();

const uploadCarImage = multer(uploadConfig);

carsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);

carsRoutes.get("/available", listAvailableCarsController.handle);

carsRoutes.post(
  "/specifications/:id",
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecficiationController.handle
);

carsRoutes.post(
  "/images/:id",
  ensureAuthenticated,
  ensureAdmin,
  uploadCarImage.array("images"),
  uploadCarImageController.handle
);

export { carsRoutes };
