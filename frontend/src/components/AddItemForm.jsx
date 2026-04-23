import { useState } from "react";
import { itemAPI } from "../services/api";
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

const defaultForm = {
  name: "",
  quantity: "1",
  category: "other",
  notes: "",
  priority: "medium",
};

export default function AddItemForm({ houseId, onAdded }) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Item name is required.");

    setLoading(true);
    try {
      const { data } = await itemAPI.add({ ...form, houseId });
      onAdded(data.item);
      setForm(defaultForm);
      setExpanded(false);
      toast.success(`"${data.item.name}" added to list!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-stone-200
                   text-stone-400 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-100/30
                   transition-all duration-200 font-body text-sm font-medium"
      >
        <span className="text-lg">＋</span>
        Add item to list
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card border-sage-200 shadow-soft animate-slide-down"
    >
      <h3 className="font-display font-bold text-stone-700 text-sm mb-3">
        Add item
      </h3>

      {/* Quick entry row */}
      <div className="flex gap-2 mb-3">
        <input
          autoFocus
          className="input flex-1"
          placeholder="Item name, e.g. Oat milk"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input w-28"
          placeholder="Qty"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
      </div>

      {/* Category + Priority */}
      <div className="grid grid-cols-2 gap-2 mb-3">
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
            <option value="low">▽ Low</option>
            <option value="medium">● Medium</option>
            <option value="high">▲ High</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <input
          className="input"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setExpanded(false);
            setForm(defaultForm);
          }}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Adding…" : "＋ Add item"}
        </button>
      </div>
    </form>
  );
}
