import { ChartDataset } from 'chart.js'
import { LTTB } from 'downsample'
import { useGraphContext } from '../../../context/graph_context'
import { useSignalContext } from '../../../context/signal_context'

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
  const { removeSelected } = useSignalContext()

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
      stepped: STEPPED,
      tension: TENSION,
      parsing: false,
      spanGaps: true,
    }
  }

  const remove = (signal: Metadata) => {
    const chart = ref.current

    if (chart == null) {
      return
    }

    const previous = [...chart.data.datasets]

    const filtered = previous.filter((dataset) => dataset.label != signal.name)

    chart.data.datasets = [...filtered]

    chart.stop()
    chart.update('none')

    removeSelected(signal)
  }


  const draw = (data: (Signal & { color: string })[]) => {
    const chart = ref.current

    if (chart == null) {
      return
    }

    const previous = [...chart.data.datasets]

    data.forEach((signal) => {

      const index = previous.findIndex((dataset: ChartDataset) => dataset.label === signal.name)

      const data = LTTB(signal.values, chart.chartArea.width) as any

      if (index > -1) {
        previous[index] = { ...previous[index], data }
      } else {
        previous.push(create(signal.name, signal.color, data))
      }

    })

    chart.data.datasets = [...previous]

    chart.stop()
    chart.update('none')
  }

  return { draw, remove }
}
