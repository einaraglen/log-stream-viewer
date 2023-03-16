import IndexableCache from "../../../context/cache/indexable_cache"

export const useInsertHandler = () => {
    const client = new IndexableCache("test_db")

    const insert = ({ data, range }: any) => {
        return client.insert(data, range)
    }

    return { insert }
}

