import { useEffect } from "react";
import { getSocket, joinHouseRoom, leaveHouseRoom } from "../services/socket";

/**
 * Hook to subscribe to socket events for a specific house room.
 * Joins the room on mount, leaves on unmount.
 */
export const useHouseSocket = (houseId, handlers = {}) => {
  useEffect(() => {
    if (!houseId) return;

    const socket = getSocket();
    if (!socket) return;

    joinHouseRoom(houseId);

    // Register all event handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      leaveHouseRoom(houseId);
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houseId]);
};
