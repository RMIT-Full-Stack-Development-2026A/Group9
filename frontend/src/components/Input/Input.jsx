import "./Input.css";

const Input = ({
  label,
  id,
  type = "text",
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input
        id={id}
        type={type}
        className={`input-field ${error ? "input-field--error" : ""}`}
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;