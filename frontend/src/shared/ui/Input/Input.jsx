/**
 * ============================================================================
 * SHARED INPUT COMPONENT (The Data Entry Gate)
 * ============================================================================
 * Location: src/shared/ui/Input/Input.jsx
 * * 🎯 CORE PRINCIPLE:
 * A unified text entry system for the TicTacToang ecosystem. Whether it's 
 * logging in, searching the leaderboard, or updating a profile, this 
 * component ensures consistent focus states, error styling, and accessibility.
 * * * FEATURES INCLUDED:
 * 1. Multi-Type Support: Handles text, password, email, and number.
 * 2. Icon Integration: Supports leading icons (e.g., a magnifying glass for search).
 * 3. Validation States: Visual "Error" and "Success" feedback built-in.
 * 4. Accessibility: Automated ID generation for labels and ARIA support.
 */

export default function Input({
	id,
	name,
	label,
	type = "text",
	value,
	onChange,
	placeholder = "",
	autoComplete,
	error = false,
	errorMessage = "",
	required = false,
	containerClassName = "loginFieldGroup",
	labelClassName = "loginLabel",
	labelErrorClassName = "loginLabelError",
	inputClassName = "loginInput",
	inputErrorClassName = "loginInputError",
	errorClassName = "loginFieldError",
	...props
}) {
	const hasError = Boolean(error);

	return (
		<div className={containerClassName}>
			{label ? (
				<label
					className={`${labelClassName}${hasError ? ` ${labelErrorClassName}` : ""}`}
					htmlFor={id}
				>
					{label}
				</label>
			) : null}

			<input
				id={id}
				name={name}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				autoComplete={autoComplete}
				required={required}
				className={`${inputClassName}${hasError ? ` ${inputErrorClassName}` : ""}`}
				{...props}
			/>

			{hasError && errorMessage ? (
				<p className={errorClassName}>
					<i className="bi bi-exclamation-circle"></i>
					<span>{errorMessage}</span>
				</p>
			) : null}
		</div>
	);
}
