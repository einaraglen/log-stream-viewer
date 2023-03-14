import { useGraphContext } from '../../../context/graph_context'
import { GRID_COLOR } from '../options.ts/scales'

export const useStyleHandler = () => {
  const { ref } = useGraphContext()

  const colors = () => {
    const chart = ref.current

    if (chart == null) {
      return
    }

    if (chart.options.scales.x) {
      chart.options.scales.x = {
        ...chart.options.scales.x,
        grid: {
          ...chart.options.scales.x.grid,
          color: GRID_COLOR,
          borderColor: GRID_COLOR,
        },
        ticks: {
          ...chart.options.scales.x.ticks,
          color: '#D0D3D4',
        },
      }
    }

    chart.stop()
    chart.update('none')
  }

  const formatYaxis = (value: number) => {
    // ES2020 added support for NumberFormatter, use this instead of importing npm package millify
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return formatter.format(value)
  }

  const scales = () => {
    const chart = ref.current
    if (chart == null) {
      return
    }
    Object.keys(chart.options.scales).forEach((scaleid: string, idx: number) => {
      if (scaleid === 'x') return
      const scale = chart.options.scales[scaleid]
      chart.options.scales[scaleid] = {
        ...scale,
        grid: {
          display: idx === 1,
          color: GRID_COLOR,
          borderColor: GRID_COLOR,
        },
        offset: false,
        position: 'left',
        ticks: {
          callback: formatYaxis,
          autoSkip: true,
          color: '#FFF',
        },
      }
    })

    chart.stop()
    chart.update('none')
  }

  return { colors }
}
