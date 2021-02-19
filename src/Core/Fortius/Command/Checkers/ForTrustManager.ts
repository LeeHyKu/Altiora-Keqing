import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import CheckerSimple from "../CheckerSimple";

export default class ForTrustManagers extends CheckerSimple {
    public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean { return channel.IsTrustManager(chat.Sender.Id) || user.HasTag('DEV'); }
    public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) { await this.Karin.Reject('해당 채팅방의 방장/부방장만 사용할 수 있습니다.', '관리자 전용 명령어').SendChat(chat); }
}