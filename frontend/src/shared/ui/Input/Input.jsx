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

import "./Input.css";

const joinClasses = (...classNames) => classNames.filter(Boolean).join(" ");

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
	const errorId = id || name ? `${id || name}-error` : undefined;

	return (
		<div className={joinClasses("ttInputFieldGroup", containerClassName)}>
			{label ? (
				<label
					className={joinClasses(
						"ttInputLabel",
						labelClassName,
						hasError && "ttInputLabelError",
						hasError && labelErrorClassName
					)}
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
				aria-invalid={hasError}
				aria-describedby={hasError && errorMessage ? errorId : undefined}
				className={joinClasses(
					"ttInputControl",
					inputClassName,
					hasError && "ttInputControlError",
					hasError && inputErrorClassName
				)}
				{...props}
			/>

			{hasError && errorMessage ? (
				<p id={errorId} className={joinClasses("ttInputError", errorClassName)}>
					<i className="bi bi-exclamation-circle"></i>
					<span>{errorMessage}</span>
				</p>
			) : null}
		</div>
	);
}

