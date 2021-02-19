import { ObjectId } from "mongodb";
import { ChatChannel, CustomImageCropStyle, CustomType } from "node-kakao";
import { isFunction, isNumber } from "util";
import CarouselBuilder from "../../../Karin/Contents/Carousel/CarouselBuilder";
import FeedBuilder from "../../../Karin/Contents/Feed/FeedBuilder";
import List from "../../../Karin/Contents/List/List";
import Keqing from "../../../Keqing";
import Cacher from "../../base/Cacher";
import { SchemaMarge } from "../../Types";
import UserSchema from "../UserSchema";
import UserSorter from "../UserSorter";
import RankerCache from "./RankerCache";
import RankerIndex from "./RankerIndex";

export default abstract class Ranker<C, T extends UserSorter> extends Cacher<RankerCache<C>[]>{
	constructor(base: Keqing, private _sorter: T) { super(base); }
	protected get Sorter() { return this._sorter; }

	protected abstract Manufacture(raw: SchemaMarge<UserSchema>[]): RankerCache<C>[];
	protected async Update() { return this.Manufacture(await this.Sorter.Run()); }

	public async SortByChannel(channel: ChatChannel, checker?: ((item: RankerCache<C>) => boolean) | number): Promise<RankerCache<C>[]> {
		await this.Get();
		var id = channel.Id.toString();
		var cache = [];
		for (var item of this.Data) {
			try {
				if (item.channel) { if (item.channel === id) cache.push(item); else continue; }
				else if (item.channels?.some?.(e => e === id)) cache.push(item);
				else if (item.notin?.some?.(e => e === id)) continue;
				else {
					var data = await this.Citius.User.FindByID(item.id);
					if (!data.isSyncUser && data.LocalChannelId === id) { item.channel = data.LocalChannelId; cache.push(item); }
					else if (data.JoinedChannel(channel)) { item.channels ? item.channels.push(id) : item.channels = [id]; cache.push(item); }
					else {
						if (!item.notin) item.notin = [id];
						else if (!item.notin.some(e => e === id)) item.notin.push(id);
						continue;
					}
				}

				if (checker) {
					if (isNumber(checker)) {
						if (cache.length >= checker) return cache;
					}
					else if (isFunction(checker)) {
						if ((<(item: RankerCache<C>) => boolean>checker)(item)) return cache;
					}
				}
			}
			catch {
				continue;
			}
		}

		return cache;
	}
	public async MyIndex(user: ObjectId, channel?: ChatChannel): Promise<RankerIndex> {
		await this.Get();
		var id = user.toHexString();
		var result: RankerIndex = { global: this.Data.findIndex(e => e.id.toHexString() === id) + 1, globalAll: this.Data.length };
		if (result.global === 0) return null;
		if (channel) result['local'] = (await this.SortByChannel(channel, item => item.id.toHexString() === id)).length;
		return result;
	}

	protected abstract Title(): string;
	protected abstract Description(info: RankerCache<C>): string;
	public async KarinList(page: number, channel?: ChatChannel): Promise<CarouselBuilder<List> | FeedBuilder> {
		await this.Get();
		var total = page * 5;
		var data = channel ? await this.SortByChannel(channel, total) : this.Data.slice(0, total);
		var result = this.Karin.Carousel<List>(CustomType.LIST, `랭킹:${this.Title()}`);
		for (var i = 0; i < page && i < (data.length / 5); i++) {
			var list = this.Karin.List('').Head({ TD: { T: `${this.Title()}(${channel ? '내부' : '전체'}) p.${i + 1}` } });
			for (var j = 0; j < 5 && (i * 5) + j < data.length; j++) {
				try {
					var item = data[(i * 5) + j];
					var info = await (await this.Citius.User.FindByID(item.id)).GetUserInfo();
					list.Item({
						TD: { T: info.Nickname, D: this.Description(item) },
						TH: { THU: info.ProfileImageURL, H: 200, W: 200, SC: CustomImageCropStyle.CENTER_CROP }
					});
				}
				catch {
					continue;
				}
			}
			result.add(list);
		}

		if (result.CIL.length < 1) return this.Karin.Reject('데이터가 부족하여 자료를 표시할 수 없습니다', '데이터 부족');
		else return result;
	}
}