import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  LineController,
  PointElement,
  LineElement,
  Tooltip,
  CategoryScale,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import zoom from "chartjs-plugin-zoom";
import crosshair from "chartjs-plugin-crosshair";
import { options } from "./options.ts/options";
import "chartjs-adapter-moment";
import GraphContextProvider, {
  useGraphContext,
} from "../../context/graph_context";
import GraphLoader from "./loader";
import { useDroppable } from "@dnd-kit/core";
import Indicator from "../explorer/selected/indicator";
import Warning from "./warning";

ChartJS.register(
  zoom,
  crosshair,
  LinearScale,
  TimeScale,
  LineController,
  PointElement,
  LineElement,
  Tooltip,
  CategoryScale
);

const data = { datasets: [] };

const Graph = () => {
  const { ref, status } = useGraphContext();
  const { isOver, setNodeRef } = useDroppable({
    id: "graph_area",
  });
  return (
    <GraphContextProvider>
      <div ref={setNodeRef} className="h-[35rem] relative">
        <GraphLoader open={status == "LOADING"} />
        <Warning open={status == "ERROR"} />
        <Indicator open={isOver} />
        <span className="top-2 right-2 absolute">{status}</span>
        <Chart type="line" ref={ref} options={options} data={data} />
      </div>
    </GraphContextProvider>
  );
};

export default Graph;
