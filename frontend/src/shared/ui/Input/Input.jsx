/**

 * CORE PRINCIPLE:
 * A unified text entry system for the TicTacToang ecosystem. Whether it's 
 * logging in, searching the leaderboard, or updating a profile, this 
 * component ensures consistent focus states, error styling, and accessibility.
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
	containerClassName = "ttInputFieldGroup",
	labelClassName = "ttInputLabel",
	labelErrorClassName = "ttInputLabelError",
	inputClassName = "ttInputControl",
	inputErrorClassName = "ttInputControlError",
	errorClassName = "ttInputError",
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

