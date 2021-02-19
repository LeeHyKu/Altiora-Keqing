import Esther from "../../../Esther/Esther";
import OccupationStatus from "../../../Occupation/OccupationStatus";
import StatItem from "../../../Stats/StatItem";
import StatOccupationItem from "../../../Stats/StatOccupationItem";
import Item from "../../Item";
import ItemCS from "../../ItemCS";
import Rarity from "../../Rarity";
import Enhancer from "../Enhancer/Enhancer";
import EnhanceScale from "../Enhancer/EnhanceScale";
import EnhanceStatus from "../Enhancer/EnhanceStatus";
import GearRaw from "./GearRaw";
import GearRawM from "./GearRawM";

export default class Gear<T = {}> extends Item<GearRawM<T>> {
	private level?: number;
	private occupation?: string;

	private maxdurability?: number;
	private durability?: number; //automatic

	private ehid?: string;
	private enhance?: Array<EnhanceScale>;
	private enhanceDur?: number;

	private bonus?: StatItem;
	private occbonus?: StatOccupationItem<any>;

	private occpromote?: string;
	private promoteBonus?: StatItem;

	public get Level() { return this.level || 0; }
	public get Occupation() { return this.occupation || ''; }
	public get MaxDur() { return this.maxdurability || Infinity; }
	public get Dur() { return this.MaxDur === Infinity ? Infinity : this.durability; }
	public set Dur(num) { if (this.Dur !== Infinity) this.durability = Math.min(this.MaxDur, num); }
	public Use() { this.durability--; if (this.durability <= 0) this.isDestroyed = true; return !this.Destroyed; }

	public get Enhanceable() { return !!this.ehid; }
	public get Ehid() { return this.ehid || 'unknown'; }
	public get Enhance() { return this.enhance?.length || 0; }
	public get EnhanceDur() { return this.enhanceDur || 0; }

	public get OccPromote() { return this.occpromote || 'unknown'; }
	public get PromoteBonus(): StatItem { return this.promoteBonus || {}; }


	protected HashOpt(): string { return `${this.Ehid}:${this.Enhance}:${this.EnhanceDur}:${this.Occupation}`; }

	public TryEnhance(enhancer: Enhancer): EnhanceStatus {
		if (!this.Enhanceable) return EnhanceStatus.CANT_Enhance;
		else if (this.Ehid !== enhancer.Ehid) return EnhanceStatus.INVAILD_Enhance;
		else if (this.Enhance >= 10) return EnhanceStatus.ALREADY_MAX;
		else if (this.EnhanceDur <= 0) return EnhanceStatus.DUR;
		else {
			this.enhanceDur ? this.enhanceDur-- : this.enhanceDur = 9;
			var confirm = Math.random() <= (enhancer.Surt[this.Enhance] / 100);
			if (confirm) {
				this.enhance ? this.enhance.push(enhancer.getScale(this.Enhance)) : this.enhance = [enhancer.getScale(this.Enhance)];
				return EnhanceStatus.SUCCESS;
			}
			else {
				var destroyed = Math.random() <= 0.1;
				if (destroyed) { this.isDestroyed = true; return EnhanceStatus.FAILUER_DESTROYED; }
				else return EnhanceStatus.FAILUER;
			}
		}
	}

	public Stats() {
		if (this.durability <= 0 || this.Destroyed) return {};
		else {
			var st: StatItem = {};
			if (this.bonus) {
				st = StatItem.Merge(st, this.bonus);
				if (this.enhance) this.enhance.map(e => EnhanceScale.Merge(this.bonus, e)).forEach(e => st = StatItem.Merge(st, e));
			}
			if (this.promoteBonus && this.User.GetComponent(Esther).OccupationId === this.OccPromote) st = StatItem.Merge(st, this.PromoteBonus);
			return st;
		}
	}
	public get OccStats() { return this.occbonus; }

	protected Installation(raw: GearRawM<T>) {
		if (raw.level) this.level = raw.level;
		if (raw.occupation) this.occupation = raw.occupation;

		if (raw.maxdurability) {
			this.maxdurability = raw.maxdurability;
			if (raw.durability) this.durability = raw.durability;
			else this.durability = raw.maxdurability;
		}

		if (raw.ehid && raw.ehid !== 'unknown') {
			this.ehid = raw.ehid;
			if (raw.enhance) this.enhance = raw.enhance;
			else this.enhance = [];
			if (raw.enhanceDur) this.enhanceDur = raw.enhanceDur;
			else this.enhanceDur = 10;
		} 

		if (raw.bonus) this.bonus = raw.bonus;
		if (raw.occbonus) this.occbonus = raw.occbonus;

		if (raw.occpromote) {
			this.occpromote = raw.occpromote;
			this.promoteBonus = raw.promotebonus;
		}

		this.OnInitalize(raw);
	}
	protected Export(): GearRawM<T> {
		var raw: GearRaw = {};

		if (this.level) raw['level'] = this.level;
		if (this.occupation) raw['occupation'] = this.occupation;

		if (this.maxdurability) raw['maxdurability'] = this.maxdurability;
		if (this.durability) raw['durability'] = this.durability;

		if (this.ehid) raw['ehid'] = this.ehid;
		if (this.enhance) raw['enhance'] = this.enhance;
		if (this.enhanceDur) raw['enhanceDur'] = this.enhanceDur;

		if (this.bonus) raw['bonus'] = this.bonus;
		if (this.occbonus) raw['occbonus'] = this.occbonus;

		if (this.occpromote) raw['occpromote'] = this.occpromote;
		if (this.promoteBonus) raw['promotebonus'] = this.promoteBonus;
		return Object.assign(this.OnExport(), raw);
	}
	protected Structor(): ItemCS { return Gear; }

	protected OnInitalize(arg: T) { }
	protected OnExport(): T { return <T>{}; }

	protected getTitle() { return `[${Rarity.rarityKo[this.Rareity]}] ${this.getName()}${this.level ? `(Lv.${this.Level})` : ''}\r\n${this.Occupation ? `[${this.Occupation}] 전용` : ''}(uid: ${this.Uid})`; }
	protected getInfo() {
		var str = '';
		if (this.maxdurability !== Infinity) str += `내구도: ${this.Dur}/${this.MaxDur}\r\n`;
		var stat = this.Stats();
		var i = 0, j = 0;
		for (var key in stat) {
			if (i >= 2) { i = 0; str += '\r\n'; }
			if (stat[key]) { if (j === 0) str += '--스텟--\r\n'; str += `${i == 1 ? ' | ' : ''}${StatItem.StatKr[key]}: ${stat[key]}`; i++; j++; }
		}
		if (j > 0) str += '\r\n';
		if (this.OccStats) {
			i = 0; j = 0;
			var occ = this.OccStats;
			for (var key in occ) {
				if (key === 'occupation') continue;
				if (i >= 2) { i = 0; str += '\r\n'; }
				if (occ[key]) { if (j === 0) str += '--직업스텟--\r\n'; str += `${i == 1 ? ' | ' : ''}${key}: ${occ[key]}`; i++; j++; }
			}
			if (j > 0) str += '\r\n';
		}
		
		if (this.Enhanceable) str += `--강화정보--\r\n${this.ehid}\r\n강화: ${this.Enhance}단(${this.EnhanceDur}번 가능)\r\n`;
		str += `--설명--\r\n${this.Description}`;

		return str;
	}
}