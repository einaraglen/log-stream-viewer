import { useGraphContext } from '../../../context/graph_context'
import { GRID_COLOR } from '../options.ts/scales'
import randomColor from "randomcolor"
import { useSignalContext } from '../../../context/signal_context'

export const formatYaxis = (value: number) => {
  // ES2020 added support for NumberFormatter, use this instead of importing npm package millify
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(value)
}

export const useStyleHandler = () => {
  const { ref } = useGraphContext()
  const { selected } = useSignalContext();


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
          color:"#D0D3D4"
        },
      }
    }

    chart.stop()
    chart.update('none')
  }

  const scales = () => {
    const chart = ref.current

    if (chart == null || selected.length == 0) {
      return
    }

    delete chart.options.scales.y

    selected.forEach(({ name, color }, i: number) => {
      const scale = chart.options.scales[name] || { }

      chart.options.scales[name] = {
        ...scale,
        grid: {
          display: i == 0,
          color: GRID_COLOR,
          borderColor: GRID_COLOR,
        },
        offset: false,
        position: 'left',
        ticks: {
          callback: formatYaxis,
          autoSkip: true,
          color
        },
      }
    })

    chart.stop()
    chart.update('none')
  }

  return { colors, scales }
}
