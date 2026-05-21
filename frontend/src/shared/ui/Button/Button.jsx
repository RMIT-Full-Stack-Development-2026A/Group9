/**
 * CORE PRINCIPLE: 
 * One component, every action. We use 'variants' to dictate the 
 * "emotional weight" of an action (Danger, Success, Ghost). 
 * This ensures consistent loading spinners, ripple effects, 
 * and accessibility across the entire app.
 */
import "./Button.css";

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
			className={`ttButton ${className}`.trim()}
			style={{ backgroundColor: color, color: textColor, ...style }}
			{...props}
		>
			{icon}
			{children ?? text}
		</button>
	);
}
