export enum Connection {
  ReadOnly = "readonly",
  ReadWrite = "readwrite",
}

export enum Query {
  Keys,
  Values,
}

class IndexedUtils {
  private database: string;
  private METADATA_TABLE: string = "_metadata";
  private version?: number;

  public constructor(database: string) {
    this.database = database;
  }

  public key({ id, name }: any) {
    // TODO add id to key
    return `${name}`;
  }

  private connect(
    table: string,
    type: Connection,
    version?: number
  ): Promise<IDBObjectStore> {
    return new Promise((resolve: any, reject: any) => {
      const connection = indexedDB.open(this.database, version || this.version);

      connection.onerror = (event) => reject(event);
      connection.onupgradeneeded = (event: any) =>
        this.tables(table, event.target.result);
      connection.onsuccess = (event: any) => {
        const db: IDBDatabase = event.target.result;
        this.version = db.version;

        db.onversionchange = (event: any) => {
          db.close();
        };

        if (!db.objectStoreNames.contains(table.toString())) {
          return reject("No such store exists");
        }

        const transaction = db.transaction([table.toString()], type);
        const store = transaction.objectStore(table.toString());

        resolve(store);
      };
    });
  }

  public async open(table: string, type: Connection): Promise<IDBObjectStore> {
    try {
      // will resolve if table we are accessing exists
      return await this.connect(table, type);
    } catch (e) {
      // since table does not exist we bumb version to create new table
      return await this.connect(table, type, this.version! + 1);
    }
  }

  public tables(table: string, db: IDBDatabase): void {
    if (!db.objectStoreNames.contains(table.toString())) {
      const request = db.createObjectStore(table.toString());

      request.transaction.oncomplete = () =>
        console.info(`Created Store for signal "${table}"`);
    }

    if (!db.objectStoreNames.contains(this.METADATA_TABLE)) {
      const request = db.createObjectStore(this.METADATA_TABLE);
      request.transaction.oncomplete = () =>
        console.info(`Created Store for signal Aggregator`);
    }
  }

  public query(table: string, range: Interval, type: Query): Promise<number[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await this.open(table, Connection.ReadOnly);
        const bounds = IDBKeyRange.bound(range[0], range[1]);
        const request =
          type === Query.Values
            ? store.getAll(bounds)
            : store.getAllKeys(bounds);

        request.onsuccess = (event: any) => {
          const matches = event.target.result;

          resolve(matches);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  public splice(ranges: Interval[]): Interval[] {
    if (ranges.length === 0) return ranges;
    const result: Interval[] = [];
    const sorted = ranges.sort((a, b) => a[0] - b[0]);

    let previous = sorted[0];

    for (let i = 1; i < sorted.length; i += 1) {
      const current = sorted[i];
      if (previous[1] >= current[0]) {
        previous = [previous[0], Math.max(previous[1], current[1])];
      } else {
        result.push(previous);
        previous = sorted[i];
      }
    }

    result.push(previous);

    return result;
  }

  private intersects(range: Interval, interval: Interval): boolean {
    const from = interval[0] >= range[0] && interval[0] <= range[1];
    const to = interval[1] >= range[1] && interval[1] <= range[1];
    const intersect_from = range[0] >= interval[0] && range[0] <= interval[1];
    const intersect_to = range[1] >= interval[0] && range[1] <= interval[1];

    return from || to || intersect_from || intersect_to;
  }

  public cache(table: string, range: Interval): Promise<Interval[]> {
    return new Promise(async (resolve, reject) => {
      const store = await this.open(this.METADATA_TABLE, Connection.ReadOnly);
      const request = store.get(table);

      request.onsuccess = (event: any) => {
        const match = event.target.result;
        if (!match) return resolve([]);
        const matches = match.filter((current) =>
          this.intersects(range, current)
        );

        resolve(matches);
      };
    });
  }

  public size(table: string) {
    return new Promise(async (resolve, reject) => {
      const store = await this.open(table, Connection.ReadOnly);

      const request = store.count();
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
    });
  }

  public last(table: string) {
    return new Promise(async (resolve, reject) => {
      const store = await this.open(table, Connection.ReadOnly);

      const request = store.openCursor()

      request.onsuccess = (event: any) => {
        const cursor = event.target.result;

        if (cursor) {
          const { key, value } = cursor
          resolve([{ x: key, y: value }])
        }
      };
    });
  }

  public gaps(cached: Interval[], range: Interval): Interval[] {
    let [from, to] = range;

    if (cached.length === 0) {
      return [range];
    }

    return cached.reduce<Interval[]>((res, curr, i) => {
      if (from < curr[0]) {
        res.push([from, curr[0]]);
      }

      if (i == cached.length - 1 && to > curr[1]) {
        res.push([curr[1], to]);
      }

      from = curr[1];
      return res;
    }, []);
  }

  public async aggregate(queue: { id: string; range: Interval }[]) {
    queue.forEach(async (item, index) => {
      const store = await this.open(this.METADATA_TABLE, Connection.ReadWrite);

      const request = store.get(item.id);

      request.onsuccess = (event: any) => {
        const match = event.target.result;
        if (!match) return store.put([[item.range[0], item.range[1]]], item.id);
        const ranges = [...match, [item.range[0], item.range[1]]];
        store.put(this.splice(ranges), item.id);
      };
    });
  }
}

export default IndexedUtils;
