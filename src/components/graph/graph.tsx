import React from 'react'
import { Chart as ChartJS, LinearScale, TimeScale, LineController, PointElement, LineElement, Tooltip, CategoryScale } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import zoom from 'chartjs-plugin-zoom'
import crosshair from 'chartjs-plugin-crosshair'
import { options } from './options.ts/options'
import 'chartjs-adapter-moment'
import GraphContextProvider, { useGraphContext } from '../../context/graph_context'

ChartJS.register(zoom, crosshair, LinearScale, TimeScale, LineController, PointElement, LineElement, Tooltip, CategoryScale)

const data = { datasets: [] };

const Graph = () => {
  const { ref, status } = useGraphContext()
  return (
    <GraphContextProvider>
      <div className="h-[35rem] relative">
        <div className='absolute top-2 right-2'>
            <span className='font-semibold'>{status || "waiting"}</span>
        </div>
        <Chart type="line" ref={ref} options={options} data={data} />
      </div>
    </GraphContextProvider>
  )
}

export default Graph
