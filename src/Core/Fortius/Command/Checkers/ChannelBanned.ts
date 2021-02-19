import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import Checkable from "../Checkable";
import CheckerSimple from "../CheckerSimple";

export default class ChannelBanned extends CheckerSimple {
    public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData, checkable: Checkable): boolean {
        return checkable.critical || !channel.CommandBanned(issued);
    }
    public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) {
        await this.Karin.Reject(`명령어 ${issued}는 현재 본 채팅방에서 금지된 상태입니다.`, '명령어 비활성화 상태').SendChat(chat);
    }
}