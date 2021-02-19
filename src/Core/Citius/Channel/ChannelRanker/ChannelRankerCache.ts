import { ObjectId } from "mongodb";

type ChannelRankerCache<T> = { id: ObjectId } & T;
export default ChannelRankerCache;