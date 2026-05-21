// Billing module registration entry point.
// Mounts all billing routes under `/api/billing` during app bootstrap.
import billingRoutes from "./routes/billing.route.js";

export default function registerBillingModule(app) {
	app.use("/api/billing", billingRoutes);
}