type Interval = [number, number]

type Discovery = {
  signal: {
    id: number
    name: string
  }
  cache: Interval[]
  gaps: Interval[]
}

type Value = {
  x_axis: number
  y_axis: number
}

type Signal = {
  id: number
  name: string
  values: Value[]
}

type Metadata = {
  from: string
  to: string
  id: number
  log_id: number
  name: string
  path?: string
  size: number
}
