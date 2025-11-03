import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { supabase } from "../lib/supabase";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    return { error: "Invalid email or password" };
  }

  console.log("Login successful! User:", data.user.email);
  console.log("JWT token has been stored in localStorage");

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/";

  return redirect(redirectTo);
}

export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const wasRedirected = searchParams.has("redirect");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to continue using the chatbot</p>

        {justRegistered && (
          <div className="success-message">
            Account created successfully! Please log in.
          </div>
        )}

        {wasRedirected && (
          <div className="info-message">
            Your session has expired. Please log in again.
          </div>
        )}

        <Form method="post" className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="Your password"
            />
          </div>

          {actionData?.error && (
            <div className="error-message">{actionData.error}</div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </Form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>

        <div className="auth-hint">
          <p>
            <strong>Explore JWTs:</strong> After logging in, open DevTools →
            Application → Local Storage to see your JWT token. Copy it and paste
            it at{" "}
            <a href="https://jwt.io" target="_blank" rel="noopener noreferrer">
              jwt.io
            </a>{" "}
            to decode it!
          </p>
        </div>
      </div>
    </div>
  );
}
