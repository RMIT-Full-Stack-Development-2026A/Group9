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
