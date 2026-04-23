import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { houseAPI } from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function JoinHousePage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return toast.error("Please enter an invite code.");
    setLoading(true);
    try {
      const { data } = await houseAPI.join({ inviteCode: code.trim() });
      toast.success(data.message);
      navigate(`/houses/${data.house._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join house.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="page-container">
        <div className="mb-6 animate-fade-in">
          <Link
            to="/dashboard"
            className="text-sm text-stone-400 hover:text-stone-600 font-body transition-colors inline-flex items-center gap-1"
          >
            ← Back
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-2">
            Join a house
          </h1>
          <p className="text-stone-400 text-sm font-body mt-1">
            Enter the invite code shared by your housemate.
          </p>
        </div>

        <div className="card shadow-soft animate-slide-up max-w-sm mx-auto">
          <div className="text-center mb-6">
            <span className="text-5xl">🔑</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Invite code</label>
              <input
                autoFocus
                className="input text-center font-mono text-xl tracking-widest uppercase"
                placeholder="XXXXXXXX"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 8),
                  )
                }
                maxLength={8}
              />
              <p className="text-xs text-stone-400 font-body mt-1.5 text-center">
                8-character code, e.g. AB12CD34
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to="/dashboard"
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading || code.length < 8}
              >
                {loading ? "Joining…" : "Join house"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-stone-400 font-body">Don't have a code?</p>
          <Link
            to="/houses/create"
            className="text-sage-600 font-medium text-sm hover:underline"
          >
            Create your own house instead →
          </Link>
        </div>
      </main>
    </div>
  );
}
