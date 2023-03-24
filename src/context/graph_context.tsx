import React, { ReactNode } from "react";
import { useEffect } from "react";
import { create } from "zustand";
import { useDataHandler } from "../components/graph/handlers/data";
import { useInteractionHandler } from "../components/graph/handlers/interactions";
import { useNavigationHandler } from "../components/graph/handlers/navigation";
import { useStyleHandler } from "../components/graph/handlers/style";
import { useSignalContext } from "./signal_context";

export type GraphContext = {
  ref: { current: any };
  range: { from: number; to: number } | null;
  status: null | string;
  setStatus: (status: string) => void;
  set: any;
};

export const useGraphContext = create<GraphContext>((set: any) => ({
  ref: { current: null },
  range: null,
  status: null,
  setStatus: (status: string) => set({ status }),
  set,
}));

interface Props {
  children: ReactNode;
}

const GraphContextProvider = ({ children }: Props) => {
  const { interactions } = useInteractionHandler();
  const { navigate } = useNavigationHandler();
  const { colors, scales } = useStyleHandler();

  const { onStatus, onRange } = useDataHandler();

  const { range, status } = useGraphContext();
  const { selected } = useSignalContext();

  useEffect(() => {
    interactions();
    colors();
    navigate(1677255745888, 1677255745888 + 100000);
  }, []);

  useEffect(() => {
    scales()
    onRange();
}, [selected]);

  useEffect(() => {
    if (status == null || status == "LOADING") {
      return;
    }

    onStatus();
  }, [status]);

  useEffect(() => {
    if (range == null) {
      return;
    }

    onRange();
  }, [range]);

  return <>{children}</>;
};

export default GraphContextProvider;
