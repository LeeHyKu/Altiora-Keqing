import { Chat } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import Checkable from "./Checkable";

export default abstract class SyncChat extends Checkable {
	public abstract Execute(chat: Chat, user: UserData, channel: ChannelData): any | Promise<any>;
}