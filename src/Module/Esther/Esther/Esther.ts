import { CustomType } from "node-kakao";
import UserComponent from "../../../Core/Citius/User/UserComponent";
import CarouselBuilder from "../../../Core/Karin/Contents/Carousel/CarouselBuilder";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Erica from "../../Erica/Component/Erica";
import ForceType from "../../Odin/Battle/ForceType";
import Hermes from "../Occupation/Hermes";
import Occupation from "../Occupation/Occupation";
import OccupationC from "../Occupation/OccupationC";
import OccupationCS from "../Occupation/OccupationCS";
import StatItem from "../Stats/StatItem";
import StatLevel from "../Stats/StatLevel";
import StatOccupation from "../Stats/StatOccupation";
import Stats from "../Stats/Stats";
import Armor from "../Venti/Items/Armor/Armor";
import Weapon from "../Venti/Items/Weapon/Weapon";
import Venti from "../Venti/Venti";
import EstherRaw from "./EstherRaw";

export default class Esther extends UserComponent<EstherRaw>{
	private _kill: number;
	private _death: number;

	private _extend?: StatItem;
	private _occupation: Occupation<any>;

	private _armor?: Armor;
	private _weapon?: Weapon;

	public get Kill() { return this._kill; }
	public get Death() { return this._death; }
	public get KD() { return +(this.Kill / this.Death).toFixed(3); }

	public get Force() { return this.Weapon?.ForceType || ForceType.PHYSIC_CUT; }

	public get Extend(): Stats {
		var extend = this._extend || {};
		return {
			HP: extend.HP || 0, AP: extend.AP || 0, AGI: extend.AGI || 0, ATK: extend.ATK || 0, CRI: extend.CRI || 0, DEF: extend.DEF || 0, REG: extend.REG || 0, HIT: extend.HIT || 100, FAT: extend.FAT || 0, PAN: extend.PAN || 0
		}
	}
	public get Occupation() { return this._occupation; }
	public get OccupationId() { return this._occupation.constructor.name; }
	public OccupationIs(struct: OccupationCS) { return this._occupation instanceof struct; }
	public OccupationT<T extends Occupation<any>>(struct: OccupationC<any, T>) { return <T>this._occupation; }

	public get Armor() {
		if (!this._armor || this._armor.Destroyed || (this._armor.Occupation && this._armor.Occupation !== this._occupation.Name)) return null;
		else return this._armor;
	}
	public get Weapon() {
		if (!this._weapon || this._weapon.Destroyed || (this._weapon.Occupation && this._weapon.Occupation !== this._occupation.Name)) return null;
		else return this._weapon;
	}

	protected Initialization(): EstherRaw {
		return {
			kill: 0,
			death: 0,
			occupation: { occupation: 'Adventurer' },
		}
	}
	protected Installation(raw: EstherRaw) {
		this._kill = raw.kill;
		this._death = raw.death;

		if (raw.extend) this._extend = raw.extend;

		this._occupation = this.Citius.GetSingleton(Hermes).CreateByName(this.Data, raw.occupation);

		if (raw.armor) this._armor = <Armor>this.Citius.GetSingleton(Venti).CreateByName(this.Data, raw.armor);
		if (raw.weapon) this._weapon = <Weapon>this.Citius.GetSingleton(Venti).CreateByName(this.Data, raw.weapon);
	}
	public Raw(): EstherRaw {
		var raw: EstherRaw = {
			kill: this._kill,
			death: this._death,

			occupation: this.Occupation.Raw(),
		}

		if (this._extend) raw['extend'] = this._extend;
		if (this.Armor) raw['armor'] = this.Armor.RawI();
		if (this.Weapon) raw['weapon'] = this.Weapon.RawI();

		return raw;
	}

	public get LevelStat(): StatLevel {
		var level = this.Data.GetComponent(Erica).Level.level;
		return {
			HP: level * 40,
			AP: (Math.floor(level / 10) + 1) * 2,
			AGI: +(((Math.floor(level / 10) + 1) * 0.2) + 0.5).toFixed(3),

			ATKs: Math.floor(level / 2),
			CRIs: 5,
			DEFs: Math.floor(level / 4),
			REGs: Math.floor(level / 6),
		}
	}
	public get ItemStat(): StatItem {
		var stat: StatItem = {
			HP: 0,
			AP: 0,
			AGI: 0,

			ATK: 0,
			CRI: 0,
			DEF: 0,
			REG: 0,

			HIT: 100,

			PAN: 0,
			FAT: 0,
		}

		return [stat, ...[this.Armor, this.Weapon].filter(e => e).map(e => e.Stats())].reduce((p, n) => StatItem.Merge(p, n));
	}
	public get TotalStat(): Stats {
		var level = this.LevelStat;
		var item = this.ItemStat;

		var st: Stats = {
			HP: level.HP + (item.HP || 0),
			AP: level.AP + (item.AP || 0),
			AGI: level.AGI + (item.AGI || 0),

			ATK: item.ATK ? item.ATK + (item.ATK * (level.ATKs / 100)) : level.ATKs,
			CRI: item.CRI ? item.CRI + (item.CRI * (level.CRIs / 100)) : level.CRIs,
			DEF: item.DEF ? item.DEF + (item.DEF * (level.DEFs / 100)) : level.DEFs,
			REG: item.REG ? item.REG + (item.REG * (level.REGs / 100)) : level.REGs,

			HIT: item.HIT || 100,

			PAN: item.PAN || 0,
			FAT: Math.max(item.FAT, 1)
		}
		if (this._extend) st = Stats.Merge(st, this.Extend);
		return StatOccupation.Excute(st, this.Occupation.Scale());
	}

	public async StatFeed(): Promise<FeedBuilder> {
		var info = await this.Data.GetUserInfo();
		var str = '';
		var stat = this.TotalStat;
		var i = 0;
		for (var key in stat) {
			if (i >= 2) { i = 0; str += '\r\n'; }
			if (stat[key]) { str += `${i == 1 ? ' | ' : ''}${Stats.StatKr[key]}: ${stat[key]}`; i++; }
		}
		return this.Karin.Feed('스텟정보').Profile({ TD: { T: info.Nickname }, TH: { THU: info.ProfileImageURL, H: 200, W: 200 } }).TextFull(true).Text({
			T: `${info.Nickname}님의 스텟`,
			D: str
		});
	}
	public async InfoCarousel(): Promise<CarouselBuilder<Feed>> {
		return this.Karin.Carousel<Feed>(CustomType.FEED, 'Esther 정보').add(
			await this.StatFeed(),
			this.Occupation.Stats()
		);
	}
}