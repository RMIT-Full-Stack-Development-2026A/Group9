/**
 * ============================================================================
 * UNIVERSAL UI BUTTON (The Interaction Engine)
 * ============================================================================
 * Location: src/shared/ui/Button/Button.jsx
 * * 🎯 CORE PRINCIPLE: 
 * One component, every action. We use 'variants' to dictate the 
 * "emotional weight" of an action (Danger, Success, Ghost). 
 * This ensures consistent loading spinners, ripple effects, 
 * and accessibility across the entire app.
 * * * FEATURES INCLUDED:
 * 1. Variant Control: primary, secondary, outline, ghost, danger, premium.
 * 2. Icon Support: Optional leading/trailing icons.
 * 3. Loading State: Built-in spinner that disables the button to prevent double-clicks.
 * 4. Sizing Logic: sm, md, lg to fit different layouts (e.g., small 'Edit' vs large 'Play').
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
