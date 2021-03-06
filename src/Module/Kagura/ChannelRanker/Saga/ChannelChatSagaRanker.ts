import ChannelRanker from "../../../../Core/Citius/Channel/ChannelRanker/ChannelRanker";
import ChannelRankerCache from "../../../../Core/Citius/Channel/ChannelRanker/ChannelRankerCache";
import ChannelSchema from "../../../../Core/Citius/Channel/ChannelSchema";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import Keqing from "../../../../Core/Keqing";
import ChannelChatSagaI from "./ChannelChatSagaI";
import ChannelChatSagaSorter from "./ChannelChatSagaSorter";

export default class ChannelChatSagaRanker extends ChannelRanker<ChannelChatSagaI, ChannelChatSagaSorter> {
    constructor(base: Keqing) { super(base, new ChannelChatSagaSorter(base.Citius.Channel)); }
    private _date: Date;

    protected Manufacture(raw: SchemaMarge<ChannelSchema>[]): ChannelRankerCache<ChannelChatSagaI>[] {
        var map = e => e.index;
        var reduce = (p, n) => p + n;
        var date = new Date();
        var find = el => el.date.toDateString() === date.toDateString();
        return raw.map(e => {
            return {
                id: e._id,
                index: e.component['KaguraChannel']['chats'].map(map).reduce(reduce),
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
        return '전체 채팅순위';
    }
    protected Description(info: ChannelRankerCache<ChannelChatSagaI>): string {
        return `${info.index}회 (금일 ${info.daily}회)`;
    }
}