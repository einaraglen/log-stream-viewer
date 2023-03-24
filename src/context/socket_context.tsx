import React, { ReactNode } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { create } from "zustand";
import IndexedCache from "./cache/indexed_cache";
import { useGraphContext } from "./graph_context";
import { useSignalContext } from "./signal_context";

const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : `${process.env.LOG_API_URL}/stream`;

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
  const { setSignals } = useSignalContext();
  const { setStatus } = useGraphContext();

  const onResponse = (payload: any) => {
    // TODO: use system uuid for db opening
    const client = new IndexedCache("test_db");
    client.insert(payload.data, payload.range);
  };

  const onSignals = (payload: any) => {
    setSignals(payload);
  };

  const onStatus = (payload: any) => {
    setStatus(payload);
  };

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", () => onDisconnect);

    socket.on("response", onResponse);
    socket.on("signals", onSignals);
    socket.on("status", onStatus);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      socket.off("response", onResponse);
      socket.off("signals", onSignals);
      socket.off("status", onStatus);
    };
  }, []);

  return <>{children}</>;
};

export default SocketContextProvider;
