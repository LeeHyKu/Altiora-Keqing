import { ChatChannel, Long } from "node-kakao";

type UserQuery = [user: Long, channel: ChatChannel];
export default UserQuery;