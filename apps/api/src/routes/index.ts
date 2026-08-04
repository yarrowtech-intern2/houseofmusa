import { Router } from "express";
import { authRouter } from "./auth.routes";
import { contactsRouter } from "./contacts.routes";
import { productsRouter } from "./products.routes";
import { careerRolesRouter } from "./careerRoles.routes";
import { applicationsRouter } from "./applications.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/contacts", contactsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/career-roles", careerRolesRouter);
apiRouter.use("/applications", applicationsRouter);
