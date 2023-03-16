import React, { ReactNode } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { create } from "zustand";
import IndexableCache from "./cache/indexable_cache";
import { useGraphContext } from "./graph_context";
import { useSignalContext } from "./signal_context";

const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : "http://localhost:8080/stream";

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
    const client = new IndexableCache("test_db")
        return client.insert(payload.data, payload.range)
  };

  const onSignals = (payload: any) => {
    setSignals(payload);
  };

  const onStatus = (payload: any) => {
    setStatus(payload)
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
