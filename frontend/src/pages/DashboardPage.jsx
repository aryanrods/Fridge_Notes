import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { houseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import HouseCard from "../components/HouseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const { data } = await houseAPI.getAll();
        setHouses(data.houses);
      } catch {
        toast.error("Failed to load your houses.");
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="page-container">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <p className="text-stone-400 font-body text-sm mb-1">{greeting()},</p>
          <h1 className="font-display font-extrabold text-3xl text-stone-900">
            {user?.name?.split(" ")[0]} 👋
          </h1>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-8 animate-slide-up">
          <Link
            to="/houses/create"
            className="card hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🏠
            </div>
            <div>
              <p className="font-display font-bold text-sm text-stone-800">
                New house
              </p>
              <p className="text-xs text-stone-400 font-body">
                Start a shared list
              </p>
            </div>
          </Link>

          <Link
            to="/houses/join"
            className="card hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🔑
            </div>
            <div>
              <p className="font-display font-bold text-sm text-stone-800">
                Join house
              </p>
              <p className="text-xs text-stone-400 font-body">
                Use an invite code
              </p>
            </div>
          </Link>
        </div>

        {/* Houses */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Your houses</h2>
            {houses.length > 0 && (
              <span className="badge-gray">{houses.length}</span>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : houses.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-5xl mb-3">🏡</div>
              <h3 className="font-display font-bold text-stone-700 mb-2">
                No houses yet
              </h3>
              <p className="text-sm text-stone-400 font-body mb-6">
                Create a house or join one with an invite code.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/houses/create" className="btn-primary">
                  Create house
                </Link>
                <Link to="/houses/join" className="btn-secondary">
                  Join house
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {houses.map((house) => (
                <div key={house._id} className="animate-fade-in">
                  <HouseCard house={house} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
