import React, { ReactNode } from "react";
import { useEffect } from "react";
import { create } from "zustand"
import { useInteractionHandler } from "../components/graph/handlers/interactions";
import { useNavigationHandler } from "../components/graph/handlers/navigation";
import { useStyleHandler } from "../components/graph/handlers/style";
import { useSocketContext } from "./socket_context";

export type GraphContext = {
    ref: { current: any }
    range: { from: number, to: number }
    set: any
}

export const useGraphContext = create<GraphContext>((set: any) => ({
    ref: { current: null },
    range: { from: 0, to : 0 },
    set
}))

interface Props {
    children: ReactNode
}

const GraphContextProvider = ({ children }: Props) => {
    const { interactions } = useInteractionHandler()
    const { navigate } = useNavigationHandler()
    const { colors } = useStyleHandler()

    const { range } = useGraphContext()
    const { socket } = useSocketContext()


    useEffect(() => {
        interactions()
        colors()
        navigate(1677255745888, 1677255745888 + 100000)
    }, [])

    useEffect(() => {
        const { from, to } = range;
        socket.emit("request", { signals: [53], ranges: [[from, to],[from, to]] })
    }, [range])

    return (<>{children}</>)
}

export default GraphContextProvider;