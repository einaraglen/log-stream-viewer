import { useGraphContext } from '../../../context/graph_context'
import { GRID_COLOR } from '../options.ts/scales'
import { useSignalContext } from '../../../context/signal_context'

const x_axis_base = (x: any) => ({
  ...x,
  grid: {
    ...x.grid,
    color: GRID_COLOR,
    borderColor: GRID_COLOR,
  },
  ticks: {
    ...x.ticks,
    color:"#D0D3D4"
  },
})

const y_axis_base = (color: string = "#D0D3D4", display: boolean = true) => ({
  grid: {
    display,
    color: GRID_COLOR,
    borderColor: GRID_COLOR,
    tickColor: GRID_COLOR,
  },
  border: {
    color: GRID_COLOR
  },
  offset: false,
  position: 'left',
  ticks: {
    callback: formatYaxis,
    autoSkip: true,
    color
  },
})

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
      chart.options.scales.x = x_axis_base(chart.options.scales.x)
    }

    chart.stop()
    chart.update('none')
  }

  const wipe = () => {
    Object.keys(ref.current!.options.scales).forEach((key) => {
      if (key == "x") {
        return;
      }

      delete ref.current!.options.scales[key]
    })
  }

  const validate = () => {
    const active = selected.map((metadata) => metadata.name)
    Object.keys(ref.current!.options.scales).forEach((key) => {
      if (key == "x") {
        return;
      }

      if (active.includes(key)) {
        return;
      }

      delete ref.current!.options.scales[key]
    })
  }

  const scales = () => {
    const chart = ref.current

    if (chart == null) {
      return
    }

    if (selected.length == 0) {
      wipe()
      chart.options.scales.y = y_axis_base()
    } else {
      delete chart.options.scales.y
      validate()
    }

    selected.forEach(({ name, color }, i: number) => {
      const scale = chart.options.scales[name] || { }

      chart.options.scales[name] = {
        ...scale,
        ...y_axis_base(color, i == 0)
      }
    })

    chart.stop()
    chart.update('none')
  }

  return { colors, scales }
}
