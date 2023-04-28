import { Chart } from "chart.js";
import { useGraphContext } from "../../../context/graph_context";
import { debounce } from "../../../utils/tools";

type CallbackParam = {
  chart: Chart;
};

export const useInteractionHandler = () => {
  const { ref, set } = useGraphContext();

  let bounds = { min: 0, max: 0 };

  const setBounds = (chart: Chart, bool: boolean): boolean | void => {
    const { min, max } = chart.scales.x;
    bounds = { min, max };
    if (bool) return true;
  };

  const isOutOfBounds = (chart: Chart) => {
    const { min, max } = chart.scales.x;
    return bounds.min !== min || bounds.max !== max;
  };

  const onPanStart = ({ chart }: CallbackParam): boolean =>
    setBounds(chart, true) as boolean;

  const onZoomStart = ({ chart }: CallbackParam): void =>
    setBounds(chart, false) as void;

  const onInteraction = debounce(({ chart }: CallbackParam): void => {
    if (isOutOfBounds(chart)) {
      const { min, max } = chart.scales.x;
      set({ range: { from: parseInt(min as any), to: parseInt(max as any) } });
    }
  }, 500);

  const interactions = () => {
    const chart: any = ref.current;

    if (chart == null) {
      return;
    }

    const zoom = chart.options.plugins.zoom.zoom;
    const pan = chart.options.plugins.zoom.pan;

    chart.options.plugins.zoom = {
      zoom: {
        ...zoom,
        onZoomStart,
        onZoomComplete: onInteraction,
      },
      pan: {
        ...pan,
        onPanStart,
        onPan: onInteraction,
      },
    };

    chart.stop();
    chart.update("none");
  };

  const limits = (from: number, to: number) => {
    const chart = ref.current;

    if (chart == null) {
      return;
    }

    chart.options.plugins.zoom.limits = {
      x: { min: from, max: to },
    };

    chart.stop();
    chart.update("none");
  };

  return { interactions, limits };
};
