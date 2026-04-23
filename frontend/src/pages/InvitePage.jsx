import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { houseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function InvitePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await houseAPI.getById(id);
        setHouse(data.house);
      } catch {
        toast.error("Failed to load house.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const isOwner = house?.owner?._id === user?._id || house?.owner === user?._id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(house.inviteCode);
      setCopied(true);
      toast.success("Invite code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  const handleRegenerate = async () => {
    if (!confirm("Regenerate the invite code? The old code will stop working."))
      return;
    setRegenerating(true);
    try {
      const { data } = await houseAPI.regenerateCode(id);
      setHouse((prev) => ({ ...prev, inviteCode: data.inviteCode }));
      toast.success("New invite code generated.");
    } catch {
      toast.error("Failed to regenerate code.");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  if (!house) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="page-container">
        <div className="mb-6 animate-fade-in">
          <Link
            to={`/houses/${id}`}
            className="text-sm text-stone-400 hover:text-stone-600 font-body transition-colors inline-flex items-center gap-1"
          >
            ← Back to {house.name}
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-stone-900 mt-2">
            Invite members
          </h1>
          <p className="text-stone-400 text-sm font-body mt-1">
            Share this code with your housemates.
          </p>
        </div>

        {/* Invite code card */}
        <div className="card shadow-soft mb-5 animate-slide-up">
          <div className="text-center">
            <p className="text-xs text-stone-400 font-body uppercase tracking-wider mb-3">
              Invite code for
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">{house.emoji}</span>
              <span className="font-display font-bold text-xl text-stone-800">
                {house.name}
              </span>
            </div>

            {/* The code */}
            <div
              onClick={handleCopy}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-cream-100 border-2 border-dashed border-stone-300
                         cursor-pointer hover:bg-cream-200 hover:border-sage-400 transition-all duration-200 mb-4 group"
            >
              <span className="font-mono font-bold text-3xl tracking-[0.3em] text-stone-800">
                {house.inviteCode}
              </span>
              <span
                className={`text-sm transition-all ${copied ? "text-sage-500" : "text-stone-400 group-hover:text-stone-600"}`}
              >
                {copied ? "✓ Copied" : "Copy"}
              </span>
            </div>

            <p className="text-xs text-stone-400 font-body">
              Click the code to copy it to your clipboard
            </p>
          </div>

          {isOwner && (
            <div className="mt-5 pt-4 border-t border-stone-100 flex justify-center">
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="btn-secondary text-xs gap-1.5"
              >
                <svg
                  className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {regenerating ? "Regenerating…" : "Regenerate code"}
              </button>
            </div>
          )}
        </div>

        {/* How to join instructions */}
        <div
          className="card mb-5 animate-slide-up"
          style={{ animationDelay: "0.05s" }}
        >
          <h3 className="font-display font-bold text-stone-800 mb-3 text-sm">
            How to join
          </h3>
          <ol className="space-y-2">
            {[
              "Your housemate creates a FridgeNotes account",
              'They go to Dashboard → "Join house"',
              `They enter the code: ${house.inviteCode}`,
              "Done — they can see and update the list instantly!",
            ].map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm font-body text-stone-600"
              >
                <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-600 text-xs font-display font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Members list */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title text-base">Current members</h3>
            <span className="badge-gray">{house.members?.length}</span>
          </div>

          <div className="space-y-2">
            {house.members?.map((member) => {
              const initials =
                member.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?";
              const memberIsOwner =
                house.owner?._id === member._id || house.owner === member._id;
              const isYou = member._id === user?._id;

              return (
                <div
                  key={member._id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-stone-100"
                >
                  <div className="w-9 h-9 rounded-full bg-sage-200 text-sage-700 flex items-center justify-center text-sm font-display font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-sm text-stone-800 truncate">
                      {member.name}{" "}
                      {isYou && (
                        <span className="text-stone-400 font-normal">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-stone-400 truncate">
                      {member.email}
                    </p>
                  </div>
                  {memberIsOwner && (
                    <span className="badge-sage shrink-0">Owner</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center animate-fade-in">
          <Link to={`/houses/${id}`} className="btn-primary">
            ← Back to grocery list
          </Link>
        </div>
      </main>
    </div>
  );
}
