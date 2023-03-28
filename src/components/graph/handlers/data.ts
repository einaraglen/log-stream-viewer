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

  const onRange = async () => {
    if (range == null || selected.length == 0) {
      return 
    }

    const { from, to } = range;

    // socket.emit("request", { signals: selected.map(s => s.name), ranges: [[from, to]] });

    // TODO: use system uuid for db opening
    const client = new IndexedCache("test_db");

    const discovery = await client.discover(selected, [from, to]);

    discovery.forEach(async ({ signal, cache, gaps }) => {
      if (cache.length != 0) {
        const values = await client.find(signal, [from, to]);
        draw([{ ...signal, values }]);
      }

      if (gaps.length != 0) {
        socket.emit("request", { signals: [signal.name], ranges: gaps });
      }
    });
  };

  return { onStatus, onRange };
};
