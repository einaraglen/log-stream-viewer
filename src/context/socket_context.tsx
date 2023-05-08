import React, { ReactNode } from "react";
import { io } from "socket.io-client";
import { create } from "zustand";
import { useNavigationHandler } from "../components/graph/handlers/navigation";
import IndexedCache from "./cache/indexed_cache";
import { useGraphContext } from "./graph_context";
import { useSignalContext } from "./signal_context";
import { useInteractionHandler } from "../components/graph/handlers/interactions";

const URL = `${import.meta.env.VITE_LOG_API_URL}/stream`;

// TODO: use system uuid in query params for socket connection
export const useSocketContext = create((set: any) => ({
  socket: io(URL!),
  isConnected: false,
  onConnect: () => set({ isConnected: true }),
  onDisconnect: () => set({ isConnected: false }),
  set,
}));

interface Props {
  children: ReactNode;
}

const SocketContextProvider = ({ children }: Props) => {
  const { socket, onConnect, onDisconnect } = useSocketContext();
  const { limits } = useInteractionHandler();
  const { navigate } = useNavigationHandler();
  const { setSignals } = useSignalContext();
  const { setStatus, set } = useGraphContext();

  const onResponse = (payload: any) => {
    // TODO: use system uuid for db opening
    const client = new IndexedCache("test_db");
    client.insert(payload.timeseries, payload.range);
  };

  const onSignals = (payload: any) => {
    setSignals(payload);
  };

  const onStatus = (payload: any) => {
    setStatus(payload);
  };

  const onBounds = (payload: any) => {
    set({ bounds: { ...payload }})
    navigate(payload.to - 1.2e+5, payload.to);
    limits(payload.from, payload.to);
  }

  const subscribe = () => {
    socket.on("connect", onConnect);
    socket.on("disconnect", () => onDisconnect);

    socket.on("response", onResponse);
    socket.on("signals", onSignals);
    socket.on("bounds", onBounds);
    socket.on("status", onStatus);
  }

  const unsubscribe = () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);

    socket.off("response", onResponse);
    socket.off("signals", onSignals);
    socket.off("bounds", onBounds);
    socket.off("status", onStatus);
  }

  React.useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};

export default SocketContextProvider;
