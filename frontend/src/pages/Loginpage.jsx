import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Please fill in all fields.");
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥬</div>
          <h1 className="font-display font-extrabold text-3xl text-stone-900 mb-1">
            FridgeNotes
          </h1>
          <p className="text-stone-500 font-body text-sm">
            Your shared grocery list, updated in real-time.
          </p>
        </div>

        {/* Card */}
        <div className="card shadow-soft">
          <h2 className="font-display font-bold text-xl text-stone-800 mb-5">
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500 font-body">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-sage-600 font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-stone-400 font-body">
            🛒 Collaborate on grocery lists with your household
          </p>
        </div>
      </div>
    </div>
  );
}
