import "./Login.css";
import { useLogin } from "./Login.hook";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();

	const handleLoginSuccess = () => {
		navigate("/", { replace: true });
	};

	const { form, isSubmitting, errorMessage, handleChange, handleSubmit } = useLogin(handleLoginSuccess);
	const hasCredentialError = Boolean(errorMessage);

	return (
		<main className="loginPageRoot">
			<section className="loginHero">
				<div className="loginHeroIcon" aria-hidden="true">
					<i className="bi bi-lock"></i>
				</div>
				<h1 className="loginHeroTitle">Welcome Back</h1>
				<p className="loginHeroSubtitle">Sign in to continue your adventure</p>
			</section>

			<section className="loginCardWrap">
				<form className="loginCard" onSubmit={handleSubmit}>
					<h2 className="loginCardTitle">Sign In</h2>
					<p className="loginCardDescription">Enter your credentials to access your account</p>

					{hasCredentialError && (
						<div className="loginErrorBox" role="alert">
							<div className="loginErrorHeading">
								<i className="bi bi-exclamation-circle"></i>
								<span>Invalid credentials</span>
							</div>
							<p className="loginErrorText">{errorMessage}</p>
						</div>
					)}

					<div className="loginFieldGroup">
						<label className={`loginLabel${hasCredentialError ? " loginLabelError" : ""}`} htmlFor="identity-input">Username or Email</label>
						<input
							id="identity-input"
							className={`loginInput${hasCredentialError ? " loginInputError" : ""}`}
							name="identity"
							value={form.identity}
							onChange={handleChange}
							placeholder="Enter username or email"
							autoComplete="username"
						/>
						{hasCredentialError && (
							<p className="loginFieldError">
								<i className="bi bi-exclamation-circle"></i>
								<span>Check your username/email and password</span>
							</p>
						)}
					</div>

					<div className="loginFieldGroup">
						<label className="loginLabel" htmlFor="password-input">Password</label>
						<input
							id="password-input"
							className={`loginInput${hasCredentialError ? " loginInputError" : ""}`}
							name="password"
							type="password"
							value={form.password}
							onChange={handleChange}
							placeholder="Enter your password"
							autoComplete="current-password"
						/>
					</div>

					<div className="loginMetaRow">
						<label className="rememberMe" htmlFor="remember-check">
							<input
								id="remember-check"
								name="remember"
								type="checkbox"
								checked={form.remember}
								onChange={handleChange}
							/>
							<span>Remember me</span>
						</label>

						<button type="button" className="textButton">Forgot password?</button>
					</div>

					<button className="submitButton" type="submit">
						<i className="bi bi-lock"></i>
						<span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
					</button>

					<p className="loginFooterText">
						Don't have an account?
						<button type="button" className="textButton textButtonStrong">Create one</button>
					</p>
				</form>
			</section>
		</main>
	);
}
