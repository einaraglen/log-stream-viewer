import { useGraphContext } from "../../context/graph_context"
import { duration } from "../../utils/tools";

const Available = () => {
    const { bounds } = useGraphContext();
    return (
        <div className="w-full flex items-center space-x-4 py-1 bg-black/30 rounded-md my-2">
            <div className="w-full flex justify-end items-center">
                <span className="font-semibold">Available Data</span>
            </div>
            <div className="w-full justify-start items-center">
            <span>{bounds ? duration(bounds.from, bounds.to) : "--"}</span>
            </div>
        </div>
    )
}

export default Available;