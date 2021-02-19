import ChannelRanker from "../../../../Core/Citius/Channel/ChannelRanker/ChannelRanker";
import ChannelRankerCache from "../../../../Core/Citius/Channel/ChannelRanker/ChannelRankerCache";
import ChannelSchema from "../../../../Core/Citius/Channel/ChannelSchema";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import Keqing from "../../../../Core/Keqing";
import ChannelChatWeekI from "./ChannelChatWeekI";
import ChannelChatWeekSorter from "./ChannelChatWeekSorter";

export default class ChannelChatWeekRanker extends ChannelRanker<ChannelChatWeekI, ChannelChatWeekSorter>{
	constructor(base: Keqing) { super(base, new ChannelChatWeekSorter(base.Citius.Channel)); }
	private _date: Date;

	protected Manufacture(raw: SchemaMarge<ChannelSchema>[]): ChannelRankerCache<ChannelChatWeekI>[] {
		var week = this.Week;
		var filter = e => e.date.getTime() >= week.getTime();
		var map = e => e.index;
		var reduce = (p, n) => p + n;
		var date = new Date();
		var find = el => el.date.toDateString() === date.toDateString();
		return raw.map(e => {
			return {
				id: e._id,
				index: e.component['KaguraChannel']['chats'].filter(filter).map(map).reduce(reduce),
				daily: e.component['KaguraChannel']['chats'].find(find)?.index || 0
			};
		});
	}

	protected Check(): boolean {
		return (Date.now() - this._date.getTime()) <= 60000;
	}
	protected OnUpdate() {
		this._date = new Date();
	}

	protected Title(): string {
		return '주간 채팅순위';
	}
	protected Description(info: ChannelRankerCache<ChannelChatWeekI>): string {
		return `${info.index}회 (금일 ${info.daily}회)`;
	}

	private get Week() {
		var date = new Date();
		return new Date(new Date(date.setDate(date.getDate() - date.getDay())).toDateString());
	}
}