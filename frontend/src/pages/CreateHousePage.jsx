import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { houseAPI } from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const EMOJIS = [
  "🏠",
  "🏡",
  "🏘️",
  "🏗️",
  "🛖",
  "🏰",
  "🌿",
  "🥗",
  "🧺",
  "🫙",
  "🍳",
  "🥘",
];

export default function CreateHousePage() {
  const [form, setForm] = useState({ name: "", description: "", emoji: "🏠" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("House name is required.");
    setLoading(true);
    try {
      const { data } = await houseAPI.create(form);
      toast.success(`"${data.house.name}" created!`);
      navigate(`/houses/${data.house._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create house.");
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
            Create a house
          </h1>
          <p className="text-stone-400 text-sm font-body mt-1">
            Set up your shared grocery space.
          </p>
        </div>

        <div className="card shadow-soft animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Emoji picker */}
            <div>
              <label className="label">House emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setForm({ ...form, emoji })}
                    className={`w-10 h-10 text-xl rounded-xl transition-all duration-150
                      ${
                        form.emoji === emoji
                          ? "bg-sage-100 ring-2 ring-sage-400 scale-110"
                          : "bg-cream-100 hover:bg-cream-200"
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream-100 border border-stone-200">
              <span className="text-2xl">{form.emoji}</span>
              <span className="font-display font-bold text-stone-700 text-lg">
                {form.name || "Your house name"}
              </span>
            </div>

            <div>
              <label className="label">House name *</label>
              <input
                autoFocus
                className="input"
                placeholder="e.g. The Green Apartment"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={60}
              />
            </div>

            <div>
              <label className="label">
                Description{" "}
                <span className="normal-case font-normal">(optional)</span>
              </label>
              <input
                className="input"
                placeholder="e.g. 4B Main Street, 3rd floor"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                maxLength={200}
              />
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
                disabled={loading}
              >
                {loading ? "Creating…" : "Create house"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
