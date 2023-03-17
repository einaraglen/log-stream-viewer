import { formatYaxis } from "../handlers/style";

export const GRID_COLOR = "rgba(255, 255, 255, 0.10)";

export const scales = {
  x: {
    offset: true,
    type: "time",
    color: GRID_COLOR,
    border: {
      display: false
    },
    time: {
      tooltipFormat: "MMM DD HH:mm ss.SSSS",
      displayFormats: {
        millisecond: "ss.SSSS",
        second: "HH:mm:ss",
        minute: "MMM DD HH:mm",
        hour: "MMM DD HH:mm",
        day: "MMM DD HH:mm",
        week: "MMM DD HH:mm",
        month: "MMM DD HH:mm",
        quarter: "MMM DD HH:mm",
        year: "HMMM DD HH:mm",
      },
    },
    ticks: {
      color: GRID_COLOR,
      sampleSize: 10,
      offset: true,
      major: {
        enabled: false,
      },
      autoSkip: true,
      autoSkipPadding: 20,
      maxRotation: 0,
    },
  },
  y: {
    grid: {
      color: GRID_COLOR,
    },
    border: {
      color: GRID_COLOR
    },
    offset: false,
    position: "left",
    ticks: {
      callback: formatYaxis,
      color: "#D0D3D4",
      autoSkip: true,
    },
  },
};
