import { ObjectId } from "mongodb";

type RankerCache<T> = { id: ObjectId, channel?: string, channels?: string[], notin?: Array<string> } & T;
export default RankerCache;