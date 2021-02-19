import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import CheckerSimple from "../CheckerSimple";

export default class RequireMention extends CheckerSimple {
	public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean { return chat.getMentionContentList().length > 0 && !chat.getMentionContentList().some(e => e.UserId.toString() === this.Client.ClientUser.Id.toString() && e.UserId.toString() === chat.Sender.Id.toString()); }
	public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) { await this.Karin.Reject('『맨션』기능을 사용해 유저를 지정해주세요', '맨션필요').SendChat(chat); }
}