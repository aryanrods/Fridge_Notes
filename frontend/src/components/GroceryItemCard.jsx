import { useState } from "react";
import { itemAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORY_ICONS = {
  produce: "🥦",
  dairy: "🧀",
  meat: "🥩",
  bakery: "🍞",
  frozen: "🧊",
  beverages: "🧃",
  snacks: "🍿",
  household: "🧹",
  other: "📦",
};

const PRIORITY_COLORS = {
  low: "text-stone-400",
  medium: "text-amber-500",
  high: "text-terracotta-500",
};

export default function GroceryItemCard({
  item,
  onUpdate,
  onDelete,
  houseOwnerId,
}) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: item.name,
    quantity: item.quantity,
    category: item.category,
    notes: item.notes || "",
    priority: item.priority,
  });

  const canDelete =
    item.addedBy?._id === user?._id ||
    item.addedBy === user?._id ||
    houseOwnerId === user?._id;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const { data } = await itemAPI.togglePurchased(item._id);
      onUpdate(data.item);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!form.name.trim()) return toast.error("Item name is required.");
    setLoading(true);
    try {
      const { data } = await itemAPI.update(item._id, form);
      onUpdate(data.item);
      setEditing(false);
      toast.success("Item updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Remove "${item.name}" from the list?`)) return;
    setLoading(true);
    try {
      await itemAPI.delete(item._id);
      onDelete(item._id);
      toast.success("Item removed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div className="card border-sage-200 animate-slide-down">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="label">Item name *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Oat milk"
            />
          </div>
          <div>
            <label className="label">Quantity</label>
            <input
              className="input"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="e.g. 2 cartons"
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {Object.entries(CATEGORY_ICONS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v} {k.charAt(0).toUpperCase() + k.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select
              className="input"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="label">Notes</label>
          <input
            className="input"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Any notes?"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button className="btn-secondary" onClick={() => setEditing(false)}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSaveEdit}
            disabled={loading}
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 group
      ${
        item.purchased
          ? "bg-stone-50 border-stone-100 opacity-70"
          : "bg-white border-stone-100 hover:border-sage-200 hover:shadow-soft"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${
            item.purchased
              ? "bg-sage-500 border-sage-500"
              : "border-stone-300 hover:border-sage-400"
          }`}
      >
        {item.purchased && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base">
            {CATEGORY_ICONS[item.category] || "📦"}
          </span>
          <span
            className={`font-body font-medium text-sm ${item.purchased ? "line-through text-stone-400" : "text-stone-800"}`}
          >
            {item.name}
          </span>
          {item.quantity && item.quantity !== "1" && (
            <span className="badge-gray">{item.quantity}</span>
          )}
          <span className={`text-xs ${PRIORITY_COLORS[item.priority]}`}>
            {item.priority === "high"
              ? "▲"
              : item.priority === "medium"
                ? "●"
                : "▽"}
          </span>
        </div>
        {item.notes && (
          <p className="text-xs text-stone-400 mt-0.5 font-body">
            {item.notes}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-stone-400 font-body">
          <span>Added by {item.addedBy?.name || "Unknown"}</span>
          {item.purchased && item.purchasedBy && (
            <span>· Bought by {item.purchasedBy?.name}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg hover:bg-cream-100 text-stone-400 hover:text-stone-600 transition-colors"
          title="Edit"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-terracotta-100 text-stone-400 hover:text-terracotta-500 transition-colors"
            title="Delete"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
