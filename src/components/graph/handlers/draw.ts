import IndexableCache from "../../../context/cache/indexable_cache";
import { useGraphContext } from "../../../context/graph_context";
import { useSignalContext } from "../../../context/signal_context";
import { useSocketContext } from "../../../context/socket_context";
import { useDataHandler } from "./data";

export const useDrawHandler = () => {
  const { draw } = useDataHandler();
  const { range } = useGraphContext();
  const { selected } = useSignalContext();
  const { socket } = useSocketContext();

  const onStatus = async () => {
    const client = new IndexableCache("test_db");

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
    if (range == null) {
      return 
    }

    const { from, to } = range;
    const client = new IndexableCache("test_db");

    const discovery = await client.discover(selected, [from, to]);

    discovery.forEach(async ({ signal, cache, gaps }) => {
      if (cache.length != 0) {
        const values = await client.find(signal, [from, to]);
        draw([{ ...signal, values }]);
      }

      if (gaps.length != 0) {
        socket.emit("request", { signals: [signal.id], ranges: gaps });
      }
    });
  };

  return { onStatus, onRange };
};
