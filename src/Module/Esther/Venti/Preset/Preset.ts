import { CustomType } from "node-kakao";
import UserData from "../../../../Core/Citius/User/UserData";
import Feed from "../../../../Core/Karin/Contents/Feed/Feed";
import KeqingBase from "../../../../Core/KeqingBase";
import Item from "../Item";
import ItemC from "../ItemC";
import ItemIS from "../ItemIS";
import Rarity from "../Rarity";
import Venti from "../Venti";

export default class Preset extends KeqingBase {
	private items: ItemIS[] = [];
	public Attach(...items: ItemIS[]) { this.items.push(...items); }
	public get Items() { return this.items; }
	public GetItem<T extends Item<any> = Item<any>>(name: string, user: UserData, struct?: ItemC<any, T>) {
		var item = this.items.find(e => e.item.name === name);
		if (!item) return null;
		else return <T>this.Citius.GetSingleton(Venti).CreateByName(user, item);
	}
	public InfoCarousel() {
		return this.Karin.Carousel<Feed>(CustomType.FEED, '프리셋목록').add(...this.Items.map(e => this.Karin.Feed('').TextFull(true).Text({
			T: `[${Rarity.rarityKo[e.item.rarity]}] ${e.item.name}`,
			D: `구조: ${e.struct}\r\n${e.item.description || '설명없음'}`
		})));
	}
}