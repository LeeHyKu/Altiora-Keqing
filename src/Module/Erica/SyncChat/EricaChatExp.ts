import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import OpenChatOnly from "../../../Core/Fortius/Command/Checkers/OpenChatOnly";
import SyncChat from "../../../Core/Fortius/Command/SyncChat";
import Erica from "../Component/Erica";

export default class EricaChatExp extends SyncChat {
	readonly cooltime = 1000; //note: activate at release
	readonly checkers = [OpenChatOnly];

    Execute(chat: Chat, user: UserData, channel: ChannelData) {
        user.GetComponent(Erica).IssueExp(Math.min(Math.max(Math.floor(chat.Text.split(/\u200b| |　|\n|/).join('').length / 10), 1), 10), chat.Channel)
    }
}