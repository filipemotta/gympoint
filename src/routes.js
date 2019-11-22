import { Router } from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import StudentController from "./app/controllers/StudentController";
import PlanController from "./app/controllers/PlanController";
import authMidd from "./app/middlewares/auth";
import EnrollmentController from "./app/controllers/EnrollmentController";
import CheckinController from "./app/controllers/CheckinController";
import HelpOrderController from "./app/controllers/HelpOrderController";

const routes = Router();

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.post("/student/:id/checkin", CheckinController.store);
routes.get("/student/:id/checkin", CheckinController.index);
routes.post("/student/:id/help-order", HelpOrderController.store);
routes.get("/student/:id/help-order", HelpOrderController.index);
routes.use(authMidd);
routes.post("/student", StudentController.store);
routes.put("/student/:id", StudentController.update);
routes.post("/plan", PlanController.store);
routes.get("/plans", PlanController.index);
routes.put("/plan/:id", PlanController.update);
routes.delete("/plan/:id", PlanController.delete);
routes.post("/student/:id/enrollment", EnrollmentController.store);
routes.get("/student/:id/enrollment", EnrollmentController.index);
routes.delete("/enrollment/:id", EnrollmentController.delete);
routes.put("/enrollment/:id", EnrollmentController.update);
// routes.put("/meetups/:id", MeetupControler.update);
// routes.get("/subscriptions", SubscriptionController.index);
// routes.post("/meetup/:id/subscription", SubscriptionController.store);
// routes.post("/files", upload.single("file"), FileController.store);

export default routes;
