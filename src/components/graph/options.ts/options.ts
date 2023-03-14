import { crosshair } from './crosshair'
import { scales } from './scales'
import { tooltip } from './tooltip'
import { zoom } from './zoom'

export const options: any = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    intersect: false,
    axis: 'x',
  },
  scales,
  plugins: {
    tooltip,
    zoom,
    crosshair,
  },
}
