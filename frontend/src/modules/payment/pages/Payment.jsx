import PaymentForm from "../components/PaymentForm/PaymentForm.jsx";

// Payment page
// - Minimal wrapper page that renders the payment checkout UI component.
// - Kept intentionally thin so routing and modals can reuse `PaymentForm`.
export default function Payment() {
	return <PaymentForm />;
}