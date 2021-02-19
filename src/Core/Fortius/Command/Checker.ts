import { Chat } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import KeqingBase from "../../KeqingBase";
import Checkable from "./Checkable";

export default abstract class Checker extends KeqingBase {
	public abstract Check(issued: string, chat: Chat, user: UserData, channel: ChannelData, checkable: Checkable): boolean | Promise<boolean>;
	public abstract OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData, checkable: Checkable): any | Promise<any>;
}