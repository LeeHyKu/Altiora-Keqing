import ChannelRanker from "../../../../Core/Citius/Channel/ChannelRanker/ChannelRanker";
import ChannelRankerCache from "../../../../Core/Citius/Channel/ChannelRanker/ChannelRankerCache";
import ChannelSchema from "../../../../Core/Citius/Channel/ChannelSchema";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import Keqing from "../../../../Core/Keqing";
import ChannelChatDayI from "./ChannelChatDayI";
import ChannelChatDaySorter from "./ChannelChatDaySorter";

export default class ChannelChatDayRanker extends ChannelRanker<ChannelChatDayI, ChannelChatDaySorter>{
	constructor(base: Keqing) { super(base, new ChannelChatDaySorter(base.Citius.Channel)); }
	private _date: Date;

	protected Manufacture(raw: SchemaMarge<ChannelSchema>[]): ChannelRankerCache<ChannelChatDayI>[] {
		var date = new Date();
		var find = el => el.date.toDateString() === date.toDateString();
		return raw.map(e => { return { id: e._id, index: e.component['KaguraChannel']['chats'].find(find).index } });
	}

	protected Check(): boolean {
		return (Date.now() - this._date.getTime()) <= 60000;
	}
	protected OnUpdate() {
		this._date = new Date();
	}

	protected Title(): string {
		return '일간 채팅순위';
	}
	protected Description(info: ChannelRankerCache<ChannelChatDayI>): string {
		return `${info.index}회`;
	}
}