import IndexableUtils, { Connection, Query } from './indexable_utils'

class IndexableCache {
  private utils: IndexableUtils

  public constructor(database: string) {
    this.utils = new IndexableUtils(database)
  }

  public async discover(signals: { id: number, name: string }[], range: Interval): Promise<Discovery[]> {
    const promises = signals.map(async (signal) => {
      const cache = await this.utils.cache(this.utils.key(signal), range)
      const gaps = this.utils.gaps(cache, range)
      return { signal, cache, gaps }
    })

    return await Promise.all(promises)
  }

  public async find(signal: { id: number, name: string }, range: Interval) {
    const key = this.utils.key(signal)
    const keys = await this.utils.query(key, range, Query.Keys)
    const values = await this.utils.query(key, range, Query.Values)

    if (keys.length !== values.length) {
      throw new Error('Keys do not match Values!')
    }

    return keys.map((x_axis, i) => ({ x_axis, y_axis: values[i]}))

    // const map = new Map(keys.map((key: number, i: number) => [key, values[i]]))

    // return Object.fromEntries(map)
  }

  public async insert(signals: Signal[], range: Interval): Promise<void> {
    const start = performance.now()
    const queue: { id: string; range: Interval }[] = []

    const promises = signals.map(async (signal, i) => {
      const version = start + i
      const key = this.utils.key(signal)

      const store = await this.utils.open(key, Connection.ReadWrite, version)

      queue.push({ id: key, range })

      signal.values.forEach((value) => {
        const request = store.put(value.y_axis, value.x_axis)
        request.onerror = (event: any) => console.warn(event)
      })
    })

    await Promise.all(promises)

    this.utils.aggregate(queue)
  }
}

export default IndexableCache
