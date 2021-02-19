import { Chat } from "node-kakao";
import ChatEvent from "../../../Core/Fortius/eventhandlers/ChatEvent";
import KaguraChannel from "../Component/Channel/KaguraChannel";

export default class KaguraChatEvent extends ChatEvent {
    public async Execute(chat: Chat) {
        (await this.Citius.Channel.Find(chat.Channel)).GetComponent(KaguraChannel).Issue();
    }
}