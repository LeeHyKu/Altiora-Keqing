import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import CheckerSimple from "../CheckerSimple";

/**
 * ESSENTIAL-OPTIONAL
 */
export default class RequireTerm extends CheckerSimple {
    public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean { return user.Term; }
    public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) {
        await this.Karin.Reject(`약관 동의가 필요합니다. '${channel.Prefix}약관'으로 약관에 동의해주세요`, '약관동의 필요').SendChat(chat);
    }
}