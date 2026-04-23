import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HouseCard({ house }) {
  const { user } = useAuth();
  const isOwner = house.owner?._id === user?._id || house.owner === user?._id;

  return (
    <Link
      to={`/houses/${house._id}`}
      className="block card hover:shadow-lift hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{house.emoji || "🏠"}</span>
          <div>
            <h3 className="font-display font-bold text-stone-800 group-hover:text-sage-600 transition-colors leading-tight">
              {house.name}
            </h3>
            {house.description && (
              <p className="text-xs text-stone-400 mt-0.5 font-body">
                {house.description}
              </p>
            )}
          </div>
        </div>
        {isOwner && <span className="badge-sage shrink-0">Owner</span>}
      </div>

      <div className="flex items-center justify-between text-xs text-stone-400 font-body">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
              />
            </svg>
            {house.members?.length || 0} member
            {house.members?.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {house.pendingItems > 0 && (
            <span className="badge-terra">{house.pendingItems} needed</span>
          )}
          {house.pendingItems === 0 && house.totalItems > 0 && (
            <span className="badge-sage">All done ✓</span>
          )}
          {house.totalItems === 0 && (
            <span className="badge-gray">Empty list</span>
          )}
        </div>
      </div>
    </Link>
  );
}
