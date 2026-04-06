import billingRoutes from "./routes/billing.route.js";

export default function registerBillingModule(app) {
	app.use("/api/billing", billingRoutes);
}