import { ChartDataset } from "chart.js";
import { DataPoint, Indexable, LTTB } from "downsample";
import { useGraphContext } from "../../../context/graph_context";
import { useSignalContext } from "../../../context/signal_context";

const STEPPED = "start";
const TENSION = 0.2;
const RADIUS = 0;
const LINE = 2;

export type CustomParsing = {
  x_axis: number;
  y_axis: number;
};

export const useDrawHandler = () => {
  const { ref } = useGraphContext();
  const { removeSelected } = useSignalContext();

  const create = (
    name: string,
    color: string,
    data: Indexable<DataPoint>
  ): Partial<ChartDataset | any> => {
    return {
      label: name,
      yAxisID: name,
      data,
      backgroundColor: color,
      borderColor: color,
      type: "line" as const,
      borderWidth: LINE,
      indexAxis: "x",
      radius: RADIUS,
      fill: false,
      stepped: STEPPED,
      tension: TENSION,
      parsing: false,
      spanGaps: true,
    };
  };

  const remove = (signal: Metadata) => {
    const chart = ref.current;

    if (chart == null) {
      return;
    }

    const previous = [...chart.data.datasets];

    const filtered = previous.filter((dataset) => dataset.label != signal.name);

    chart.data.datasets = [...filtered];

    chart.stop();
    chart.update("none");

    removeSelected(signal);
  };

  const singles = (data: Indexable<DataPoint>) => {
    // TODO: check for signal datapoint in dataset, draw points at edges of graph with last value
    const chart = ref.current;

    if (chart == null || data.length > 1 || data.length == 0) {
      return data;
    }

    const { min, max } = chart.scales.x;
    const last = data[0] as { x: number; y: number };

    data[0] = { y: last.y, x: min };
    data[1] = { y: last.y, x: max };

    return data;
  };

  const draw = (data: (Signal & { color: string })[]) => {
    const chart = ref.current;

    if (chart == null) {
      return;
    }

    const previous = [...chart.data.datasets];

    data.forEach((signal) => {
      const index = previous.findIndex(
        (dataset: ChartDataset) => dataset.label === signal.name
      );

      const decimated: Indexable<DataPoint> = LTTB(signal.values,chart.chartArea.width);

      const data = singles(decimated)

      if (index > -1) {
        previous[index] = { ...previous[index], data };
      } else {
        previous.push(create(signal.name, signal.color, data));
      }
    });

    chart.data.datasets = [...previous];

    chart.stop();
    chart.update("none");
  };

  return { draw, remove };
};
