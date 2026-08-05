import { Router } from "express";
import { authRouter } from "./auth.routes";
import { contactsRouter } from "./contacts.routes";
import { productsRouter } from "./products.routes";
import { careerRolesRouter } from "./careerRoles.routes";
import { applicationsRouter } from "./applications.routes";
import { analyticsRouter } from "./analytics.routes";
import { dashboardRouter } from "./dashboard.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/contacts", contactsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/career-roles", careerRolesRouter);
apiRouter.use("/applications", applicationsRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/dashboard", dashboardRouter);
