import { useState } from "react";
import { useAuth } from "../../context/authContext";

export function useLogin(onSuccess) {
	const { login } = useAuth();
	const [form, setForm] = useState({
		identity: "",
		password: "",
		remember: false,
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		if (errorMessage) {
			setErrorMessage("");
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setErrorMessage("");

		try {
			const result = await login(form.identity, form.password);

			if (!result.success) {
				setErrorMessage(result.message || "Sign in failed");
				return;
			}

			onSuccess?.(result.user);
		} catch (error) {
			setErrorMessage(error.message || "Sign in failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		form,
		isSubmitting,
		errorMessage,
		handleChange,
		handleSubmit,
	};
}
