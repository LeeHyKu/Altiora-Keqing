import { ChannelType, CustomType, OpenChatChannel } from "node-kakao";
import CarouselBuilder from "../../../Karin/Contents/Carousel/CarouselBuilder";
import FeedBuilder from "../../../Karin/Contents/Feed/FeedBuilder";
import List from "../../../Karin/Contents/List/List";
import ListItem from "../../../Karin/Contents/List/ListItem";
import Keqing from "../../../Keqing";
import Cacher from "../../base/Cacher";
import { SchemaMarge } from "../../Types";
import ChannelSchema from "../ChannelSchema";
import ChannelSorter from "../ChannelSorter";
import ChannelRankerCache from "./ChannelRankerCache";

export default abstract class ChannelRanker<C, T extends ChannelSorter> extends Cacher<ChannelRankerCache<C>[]>{
	constructor(base: Keqing, private _sorter: T) { super(base); }
	protected get Sorter() { return this._sorter; }

	protected abstract Manufacture(raw: SchemaMarge<ChannelSchema>[]): ChannelRankerCache<C>[];
	protected async Update() { return this.Manufacture(await this.Sorter.Run()); }

	protected abstract Title(): string;
	protected abstract Description(info: ChannelRankerCache<C>): string;
	public async KarinList(page: number): Promise<CarouselBuilder<List> | FeedBuilder> {
		await this.Get();
		var total = page * 5;
		var data = this.Data.slice(0, total);
		var result = this.Karin.Carousel<List>(CustomType.LIST, this.Title());
		for (var i = 0; i < page && i < (data.length / 5); i++) {
			var list = this.Karin.List('').Head({ TD: { T: `${this.Title()} p.${i + 1}` } });
			for (var j = 0; j < 5 && (i * 5) + j < data.length; j++) {
				try {
					var item = data[(i * 5) + j];
					var info = await (await this.Citius.Channel.FindByID(item.id)).Channel;
					var listitem: ListItem = {
						TD: { T: info.getDisplayName(), D: this.Description(item) }
					};
					if (info.Type === ChannelType.OPENCHAT_GROUP) {
						var link = (<OpenChatChannel>info).getOpenLink().LinkURL
						listitem['L'] = { LPC: link, LMO: link };
					}
					list.Item(listitem);
				}
				catch { continue; }
			}
			result.add(list);
		}

		if (result.CIL.length < 1) return this.Karin.Reject('데이터가 부족하여 자료를 표시할 수 없습니다', '데이터 부족');
		else return result;
	}
}