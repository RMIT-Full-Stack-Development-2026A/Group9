export default function Button({
	color,
	text,
	onClick,
	type = "button",
	className = "",
	disabled = false,
	icon = null,
	children,
	textColor = "#ffffff",
	style = {},
	...props
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={className}
			style={{ backgroundColor: color, color: textColor, ...style }}
			{...props}
		>
			{icon}
			{children ?? text}
		</button>
	);
}
