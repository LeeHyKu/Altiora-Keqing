import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import Checker from "../Checker";

export default class Cooltime extends Checker {
	public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean { return user.HasTag('DEV') || user.CheckCool(`command:${chat.Channel.Id.toString()}:${issued}`); }
	public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) { await this.Karin.Reject('잠시 후에 다시 시도하세요.', '쿨타임').SendChat(chat); }
}