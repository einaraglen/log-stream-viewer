import IndexedUtils, { Connection, Query } from './indexed_utils'

class IndexedCache {
  private utils: IndexedUtils

  public constructor(database: string) {
    this.utils = new IndexedUtils(database)
  }

  public async discover(signals: Metadata[], range: Interval): Promise<Discovery[]> {
    const promises = signals.map(async (signal) => {
      const cache = await this.utils.cache(this.utils.key(signal), range)
      const gaps = this.utils.gaps(cache, range)
      return { signal, cache, gaps }
    })

    return await Promise.all(promises)
  }

  public async find(signal: { id: number; name: string }, range: Interval): Promise<Value[]> {
    const key = this.utils.key(signal)

    const size = await this.utils.size(key)

    if (size == 1) {
      return (await this.utils.last(key)) as any
    }

    const keys = await this.utils.query(key, range, Query.Keys)
    const values = await this.utils.query(key, range, Query.Values)

    if (keys.length !== values.length) {
      throw new Error('Keys do not match Values!')
    }

    return keys.map((x, i) => ({ x, y: values[i] })).sort((a, b) => a.x - b.x)
  }

  public async insert(timeseries: any, range: Interval): Promise<void> {
    const queue: { id: string; range: Interval }[] = []

    const promises: any = []

    for (const name in timeseries) {
      const key = this.utils.key({ name, id: 2 })
      
      queue.push({ id: key, range })

      const values = timeseries[name].values

      const res = this.utils.open(key, Connection.ReadWrite).then((store) => {
        values.forEach((row: { yAxis: number, xAxis: number }) => {
          const request = store.put(row.yAxis, row.xAxis)
          request.onerror = (event: any) => console.warn(event)
        })
      })

      promises.push(res)
    }

    await Promise.all(promises)

    this.utils.aggregate(queue)
  }
}

export default IndexedCache
