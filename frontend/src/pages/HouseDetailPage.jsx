import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { houseAPI, itemAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useHouseSocket } from "../hooks/useHouseSocket";
import Navbar from "../components/Navbar";
import GroceryItemCard from "../components/GroceryItemCard";
import AddItemForm from "../components/AddItemForm";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const CATEGORY_ORDER = [
  "produce",
  "dairy",
  "meat",
  "bakery",
  "frozen",
  "beverages",
  "snacks",
  "household",
  "other",
];
const CATEGORY_LABELS = {
  produce: "🥦 Produce",
  dairy: "🧀 Dairy",
  meat: "🥩 Meat & Fish",
  bakery: "🍞 Bakery",
  frozen: "🧊 Frozen",
  beverages: "🧃 Beverages",
  snacks: "🍿 Snacks",
  household: "🧹 Household",
  other: "📦 Other",
};

export default function HouseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [house, setHouse] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPurchased, setShowPurchased] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [clearingPurchased, setClearingPurchased] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [houseRes, itemsRes] = await Promise.all([
        houseAPI.getById(id),
        itemAPI.getByHouse(id),
      ]);
      setHouse(houseRes.data.house);
      setItems(itemsRes.data.items);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        toast.error("House not found or access denied.");
        navigate("/dashboard");
      } else {
        toast.error("Failed to load house data.");
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time socket handlers
  useHouseSocket(id, {
    "item:added": ({ item }) => {
      setItems((prev) => {
        if (prev.find((i) => i._id === item._id)) return prev;
        toast(`${item.addedBy?.name || "Someone"} added "${item.name}"`, {
          icon: "🛒",
        });
        return [item, ...prev];
      });
    },
    "item:updated": ({ item }) => {
      setItems((prev) => prev.map((i) => (i._id === item._id ? item : i)));
    },
    "item:purchased": ({ item }) => {
      setItems((prev) => prev.map((i) => (i._id === item._id ? item : i)));
      if (item.purchased) {
        toast(`✓ "${item.name}" marked as purchased`, { icon: "✅" });
      }
    },
    "item:deleted": ({ itemId }) => {
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    },
    "items:cleared": () => {
      setItems((prev) => prev.filter((i) => !i.purchased));
      toast("Purchased items cleared.", { icon: "🧹" });
    },
  });

  const handleItemAdded = (item) => {
    setItems((prev) => {
      if (prev.find((i) => i._id === item._id)) return prev;
      return [item, ...prev];
    });
  };

  const handleItemUpdated = (item) => {
    setItems((prev) => prev.map((i) => (i._id === item._id ? item : i)));
  };

  const handleItemDeleted = (itemId) => {
    setItems((prev) => prev.filter((i) => i._id !== itemId));
  };

  const handleClearPurchased = async () => {
    if (!confirm("Remove all purchased items from the list?")) return;
    setClearingPurchased(true);
    try {
      await itemAPI.clearPurchased(id);
      setItems((prev) => prev.filter((i) => !i.purchased));
      toast.success("Purchased items cleared.");
    } catch {
      toast.error("Failed to clear items.");
    } finally {
      setClearingPurchased(false);
    }
  };

  const handleLeaveHouse = async () => {
    if (
      !confirm(
        `Leave "${house.name}"? You will need a new invite code to re-join.`,
      )
    )
      return;
    try {
      await houseAPI.leave(id);
      toast.success(`Left "${house.name}".`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to leave house.");
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

  const isOwner = house.owner?._id === user?._id || house.owner === user?._id;
  const pendingItems = items.filter((i) => !i.purchased);
  const purchasedItems = items.filter((i) => i.purchased);
  const displayItems = showPurchased ? items : pendingItems;

  // Group items by category
  const grouped = {};
  if (groupByCategory) {
    displayItems.forEach((item) => {
      const cat = item.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="page-container">
        {/* Back */}
        <Link
          to="/dashboard"
          className="text-sm text-stone-400 hover:text-stone-600 font-body transition-colors inline-flex items-center gap-1 mb-4 animate-fade-in"
        >
          ← All houses
        </Link>

        {/* House header */}
        <div className="flex items-start justify-between gap-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{house.emoji || "🏠"}</span>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-stone-900 leading-tight">
                {house.name}
              </h1>
              {house.description && (
                <p className="text-sm text-stone-400 font-body mt-0.5">
                  {house.description}
                </p>
              )}
            </div>
          </div>

          {/* House actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/houses/${id}/invite`}
              className="btn-secondary py-2 px-3 text-xs gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Invite
            </Link>
            {!isOwner && (
              <button
                onClick={handleLeaveHouse}
                className="btn-danger py-2 px-3 text-xs"
              >
                Leave
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up">
          <div className="card text-center py-3">
            <p className="font-display font-bold text-2xl text-stone-800">
              {pendingItems.length}
            </p>
            <p className="text-xs text-stone-400 font-body mt-0.5">Needed</p>
          </div>
          <div className="card text-center py-3">
            <p className="font-display font-bold text-2xl text-sage-500">
              {purchasedItems.length}
            </p>
            <p className="text-xs text-stone-400 font-body mt-0.5">Purchased</p>
          </div>
          <div className="card text-center py-3">
            <p className="font-display font-bold text-2xl text-stone-800">
              {house.members?.length || 0}
            </p>
            <p className="text-xs text-stone-400 font-body mt-0.5">Members</p>
          </div>
        </div>

        {/* Members avatars */}
        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          <div className="flex -space-x-2">
            {house.members?.slice(0, 6).map((member) => {
              const initials =
                member.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?";
              return (
                <div
                  key={member._id}
                  className="w-7 h-7 rounded-full bg-sage-200 text-sage-700 flex items-center justify-center text-xs font-display font-bold border-2 border-cream-50"
                  title={member.name}
                >
                  {initials}
                </div>
              );
            })}
            {house.members?.length > 6 && (
              <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-xs font-body border-2 border-cream-50">
                +{house.members.length - 6}
              </div>
            )}
          </div>
          <span className="text-xs text-stone-400 font-body">
            {house.members?.map((m) => m.name).join(", ")}
          </span>
        </div>

        {/* Add item */}
        <div className="mb-5 animate-slide-up">
          <AddItemForm houseId={id} onAdded={handleItemAdded} />
        </div>

        {/* List controls */}
        <div className="flex items-center justify-between mb-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPurchased(!showPurchased)}
              className={`text-xs px-3 py-1.5 rounded-lg font-body font-medium transition-colors ${
                showPurchased
                  ? "bg-stone-200 text-stone-700"
                  : "bg-cream-100 text-stone-500 hover:bg-cream-200"
              }`}
            >
              {showPurchased ? "Hide purchased" : `Show all (${items.length})`}
            </button>
            <button
              onClick={() => setGroupByCategory(!groupByCategory)}
              className={`text-xs px-3 py-1.5 rounded-lg font-body font-medium transition-colors ${
                groupByCategory
                  ? "bg-stone-200 text-stone-700"
                  : "bg-cream-100 text-stone-500 hover:bg-cream-200"
              }`}
            >
              {groupByCategory ? "Ungroup" : "By category"}
            </button>
          </div>

          {purchasedItems.length > 0 && (
            <button
              onClick={handleClearPurchased}
              disabled={clearingPurchased}
              className="text-xs text-terracotta-500 hover:text-terracotta-600 font-body font-medium transition-colors disabled:opacity-50"
            >
              {clearingPurchased
                ? "Clearing…"
                : `Clear ${purchasedItems.length} purchased`}
            </button>
          )}
        </div>

        {/* Items list */}
        <div className="space-y-2 animate-slide-up">
          {displayItems.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-4xl mb-3">
                {pendingItems.length === 0 && items.length > 0 ? "🎉" : "🛒"}
              </div>
              <h3 className="font-display font-bold text-stone-700 mb-1">
                {pendingItems.length === 0 && items.length > 0
                  ? "All done!"
                  : "List is empty"}
              </h3>
              <p className="text-sm text-stone-400 font-body">
                {pendingItems.length === 0 && items.length > 0
                  ? "Everything has been purchased."
                  : "Add items above to get started."}
              </p>
            </div>
          ) : groupByCategory ? (
            CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0).map(
              (cat) => (
                <div key={cat}>
                  <p className="text-xs font-medium text-stone-400 font-body uppercase tracking-wider mt-4 mb-2">
                    {CATEGORY_LABELS[cat]}
                  </p>
                  <div className="space-y-2">
                    {grouped[cat].map((item) => (
                      <div key={item._id} className="item-enter">
                        <GroceryItemCard
                          item={item}
                          onUpdate={handleItemUpdated}
                          onDelete={handleItemDeleted}
                          houseOwnerId={house.owner?._id || house.owner}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )
          ) : (
            displayItems.map((item) => (
              <div key={item._id} className="item-enter">
                <GroceryItemCard
                  item={item}
                  onUpdate={handleItemUpdated}
                  onDelete={handleItemDeleted}
                  houseOwnerId={house.owner?._id || house.owner}
                />
              </div>
            ))
          )}
        </div>

        {/* Real-time indicator */}
        <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse-soft" />
          <p className="text-xs text-stone-400 font-body">
            Live — updates appear instantly for all members
          </p>
        </div>
      </main>
    </div>
  );
}
