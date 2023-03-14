import { useGraphContext } from '../../../context/graph_context'

export const useNavigationHandler = () => {
  const { ref } = useGraphContext()

  const zoom = (value: number) => {
    if (ref.current) {
      ref.current.zoom({ x: value })
    }
  }

  const pan = (args: any) => {
    if (ref.current) {
      ref.current.pan({ ...args }, undefined, 'normal')
    }
  }

  const reset = () => {
    if (ref.current) {
      ref.current.resetZoom()
    }
  }

  const navigate = (from: number, to: number) => {
    if (ref.current) {
      ref.current.zoomScale('x', { min: from, max: to }, 'none')
    }
  }

  return { zoom, pan, reset, navigate }
}
