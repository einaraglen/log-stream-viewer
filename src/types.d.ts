type Interval = [number, number]

type Discovery = {
  signal: Metadata
  cache: Interval[]
  gaps: Interval[]
}

type Value = {
  x: number
  y: number
}

type Signal = {
  id: number
  name: string
  values: Value[]
}

type Metadata = {
  id: number
  name: string
  path?: string
  color: string
}
