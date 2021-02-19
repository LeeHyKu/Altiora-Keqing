import { AttachmentTemplate, Chat, ChatChannel, CustomAttachment, CustomContent, CustomInfo, CustomType } from "node-kakao";
import TailerEx from "../Tail/TailerEx";

export default abstract class ContentBuilder<T extends CustomContent> {
	constructor(protected tail: TailerEx) { }

	public readonly CType: CustomType;
	public abstract Build(): T;
	Complate(): CustomAttachment {
		var info = Object.assign(this.tail);
		info['TP'] = this.CType;
		var tail = new CustomInfo();
		tail.readRawContent(info);
		return new CustomAttachment(tail, this.Build());
	}

	public async SendChannel(channel: ChatChannel) { return channel.sendTemplate(new AttachmentTemplate(this.Complate())); }
	public async SendChat(chat: Chat) { return this.SendChannel(chat.Channel); }
}