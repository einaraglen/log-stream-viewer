import React, { ReactNode } from "react";
import { useEffect } from "react";
import { create } from "zustand"
import { useDataHandler } from "../components/graph/handlers/data";
import { useInteractionHandler } from "../components/graph/handlers/interactions";
import { useNavigationHandler } from "../components/graph/handlers/navigation";
import { useStyleHandler } from "../components/graph/handlers/style";
import IndexableCache from "./cache/indexable_cache";
import { useSignalContext } from "./signal_context";
import { useSocketContext } from "./socket_context";

export type GraphContext = {
    ref: { current: any }
    range: { from: number, to: number } | null
    status: null | string
    setStatus: (status: string) => void
    set: any
}

export const useGraphContext = create<GraphContext>((set: any) => ({
    ref: { current: null },
    range: null,
    status: null,
    setStatus: (status: string) => set({ status }),
    set
}))

interface Props {
    children: ReactNode
}

const GraphContextProvider = ({ children }: Props) => {
    const { interactions } = useInteractionHandler()
    const { navigate } = useNavigationHandler()
    const { colors, scales } = useStyleHandler()
    const { draw } = useDataHandler()

    const { range, status } = useGraphContext()
    const { socket } = useSocketContext()
    const { selected } = useSignalContext()


    useEffect(() => {
        interactions()
        colors()
        navigate(1677255745888, 1677255745888 + 100000)
    }, [])

    useEffect(() => scales(), [selected])

    useEffect(() => {
        if (status == null || status == "LOADING") {
            return;
        }

        const client = new IndexableCache("test_db")

        const { from, to } = range!;

        const promises = selected.map(({ id, name, color }) => client.find({ id, name }, [from, to]).then((res: any) => ({ id, name, color, values: res })))

        Promise.all(promises).then((res) => draw(res))

    }, [status])

    useEffect(() => {
        if (range == null) {
            return 
        }

        const { from, to } = range;
        const signals = selected.map((metadata) => metadata.id)
        const client = new IndexableCache("test_db")
        client.discover(selected, [from, to]).then((res) => console.log(res)).catch((err) => console.warn(err))
       
        socket.emit("request", { signals, ranges: [[from, to]] })
    }, [range])

    return (<>{children}</>)
}

export default GraphContextProvider;