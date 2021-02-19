import { Chat, ChatType } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import CheckerSimple from "../CheckerSimple";

export default class ReplyOnly extends CheckerSimple {
    public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean { return chat.Type === ChatType.Reply; }
    public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) {
        await this.Karin.Reject('『답장하기』를 사용하여 채팅을 지정해주세요', '올바르지 않은 명령타입').SendChat(chat);
    }
}