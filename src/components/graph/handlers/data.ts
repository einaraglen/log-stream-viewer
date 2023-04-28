import { isMissingDeclaration } from "typescript";
import IndexedCache from "../../../context/cache/indexed_cache";
import { useGraphContext } from "../../../context/graph_context";
import { useSignalContext } from "../../../context/signal_context";
import { useSocketContext } from "../../../context/socket_context";
import { useDrawHandler } from "./draw";

export const useDataHandler = () => {
  const { draw } = useDrawHandler();
  const { range } = useGraphContext();
  const { selected } = useSignalContext();
  const { socket } = useSocketContext();

  const onStatus = async () => {
    // TODO: use system uuid for db opening
    const client = new IndexedCache("test_db");

    const { from, to } = range!;

    const promises = selected.map(({ id, name, color }) =>
      client
        .find({ id, name }, [from, to])
        .then((res: any) => ({ id, name, color, values: res }))
    );

    const res = await Promise.all(promises);

    draw(res);
  };

  const getPartitions = (discovery: Discovery[]): { cached: any[], missing: { signal: any, range: any }[]} => {
    return discovery.reduce<any>((res, { signal, cache, gaps }: any) => {
      if (cache.length > 0) {
        res.cached.push(signal)
      }

      if (gaps.length > 0) {
        gaps.forEach((range: any) => res.missing.push({ signal: signal.name, range }))
      }

      return res;
    }, { cached: [], missing: [] });
  }

  const onRange = async () => {
    if (range == null || selected.length == 0) {
      return 
    }

    const { from, to } = range;

    // TODO: use system uuid for db opening

    const client = new IndexedCache("test_db");

    const discovery = await client.discover(selected, [from, to]);

    const { cached, missing } = getPartitions(discovery);

    cached.forEach(async (signal) => { 
      const values = await client.find(signal, [from, to]);
      draw([{ ...signal, values }]);
    })

    socket.emit("request", missing);
  };

  return { onStatus, onRange };
};
