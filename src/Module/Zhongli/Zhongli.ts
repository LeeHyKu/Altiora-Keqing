import { Collection, ObjectId } from "mongodb";
import { CustomType } from "node-kakao";
import CarouselBuilder from "../../Core/Karin/Contents/Carousel/CarouselBuilder";
import Feed from "../../Core/Karin/Contents/Feed/Feed";
import FeedBuilder from "../../Core/Karin/Contents/Feed/FeedBuilder";
import KeqingBase from "../../Core/KeqingBase";
import Enterprise from "./Enterprise/Enterprise";
import EnterpriseRaw from "./Enterprise/EnterpriseRaw";

export default class Zhongli extends KeqingBase {
	private collection: Collection<EnterpriseRaw>;
	private act: boolean = false;

	private enterprises: Enterprise[] = [];
	public get Enterprises() { return this.enterprises; }
	public AddEnterprise(enter: Enterprise) { this.enterprises.push(enter); }

	private looper: NodeJS.Timeout;
	private isSaving: boolean = false;

	public GetJoined(id: ObjectId) { return this.enterprises.find(e => e.Joined(id)); }
	public GetByName(name: string) { return this.enterprises.find(e => e.Name === name); }
	public GetByStName(name: string) { return this.enterprises.find(e => e.StockName === name); }

	public async Search(name: string): Promise<CarouselBuilder<Feed> | FeedBuilder> {
		var car = this.Karin.Carousel<Feed>(CustomType.FEED, '검색결과');
		for (var item of this.enterprises.filter(e => e.Name.includes(name) || e.StockName === name).slice(0, 8)) car.add(await item.Info());
		if (car.CIL.length < 1) return this.Karin.Reject('검색결과가 없습니다', '데이터없음');
		else return car;
	}

	public async Ignition() {
		if (this.act) return;
		else {
			this.collection = this.Citius.GetTable<EnterpriseRaw>('Zhongli');

			var enters = await this.collection.find({ _id: { $exists: true } }).toArray();
			this.enterprises.push(...enters.map(e => new Enterprise(this.Keqing, e)));

			this.looper = setInterval(() => { this.Qurare.Focus('Zhongli Saving...'); this.SaveAll(); }, 300000);

			this.act = true;
			return;
		}
	}
	public async SaveAll() {
		if (this.isSaving) return;
		else {
			this.isSaving = true;
			for (var ent of this.enterprises) await this.collection.updateOne({ _id: ent.ID }, { $set: ent.Raw() }, { upsert: true });
			this.isSaving = false;
			return;
		}
	}
}