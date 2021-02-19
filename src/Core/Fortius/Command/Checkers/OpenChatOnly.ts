import { ChannelType, Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import CheckerSimple from "../CheckerSimple";

export default class OpenChatOnly extends CheckerSimple {
    public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean | Promise<boolean> {
        return chat.Channel.Type === ChannelType.OPENCHAT_GROUP;
    }
    public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) {
        this.Karin.Reject('오픈채팅방에서만 사용할 수 있는 명령어입니다.', '오픈채팅 전용')
    }
}