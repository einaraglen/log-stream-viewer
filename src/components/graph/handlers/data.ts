import { ChartDataset } from 'chart.js'
import { LTTB } from 'downsample'
import { useGraphContext } from '../../../context/graph_context'

const STEPPED = 'start'
const TENSION = 0.2
const RADIUS = 0
const LINE = 2

export type CustomParsing = {
  x_axis: number
  y_axis: number
}

export const useDataHandler = () => {
  const { ref } = useGraphContext()

  const create = (name: string, color: string, data: any[]): Partial<ChartDataset | any> => {
    return {
      label: name,
      yAxisID: name,
      data,
      backgroundColor: color,
      borderColor: color,
      type: 'line' as const,
      borderWidth: LINE,
      indexAxis: 'x',
      radius: RADIUS,
      fill: false,
      stepped: (data[0].y % 1 == 0) ? STEPPED : false,
      tension: TENSION,
      parsing: false,
      spanGaps: true,
    }
  }

  const draw = (data: (Signal & { color: string })[]) => {
    const chart = ref.current

    if (chart == null) {
      return
    }

    const datasets = data.map((signal) => create(signal.name, signal.color, LTTB(signal.values, chart.chartArea.width) as any))

    chart.data.datasets = [...datasets]

    chart.stop()
    chart.update('none')
  }

  return { draw }
}
