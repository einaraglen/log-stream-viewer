import { ChartDataset } from 'chart.js'
import { ChartData } from 'chart.js'
import { DataPoint, Indexable, LTTB } from 'downsample'
import { useGraphContext } from '../../../context/graph_context'

const STEPPED = 'start'
const TENSION = 0.2
const RADIUS = 0
const LINE = 2

export const base: Partial<ChartDataset | any> = {
  type: 'line' as const,
  borderWidth: LINE,
  indexAxis: 'x',
  radius: RADIUS,
  fill: false,
  stepped: false,
  tension: TENSION,
  parsing: false,
  spanGaps: true,
}

export type CustomParsing = {
  x_axis: number
  y_axis: number
}

export const useDataHandler = () => {
  const { ref } = useGraphContext()

  const create = (id: number, data: any[]): Partial<ChartDataset | any> => {
    return {
      ...base,
      label: 'Test',
      yAxisID: 'y',
      parsing: {
        xAxisKey: 'x_axis',
        yAxisKey: 'y_axis',
      },
      data,
      backgroundColor: '#FFF',
      borderColor: '#FFF',
    }
  }

  const add = (data: any) => {
    const chart = ref.current

    if (chart == null) {
      return
    }

    // const datasets = chart.data.datasets

    const dataset = create(1, LTTB(data, 500) as any)

    chart.data.datasets = [dataset]

    chart.stop()
    chart.update('none')
  }

  return { add }
}
