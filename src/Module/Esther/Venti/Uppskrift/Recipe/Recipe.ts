import { CustomType } from "node-kakao";
import { isNumber } from "util";
import UserData from "../../../../../Core/Citius/User/UserData";
import Feed from "../../../../../Core/Karin/Contents/Feed/Feed";
import Keqing from "../../../../../Core/Keqing";
import KeqingBase from "../../../../../Core/KeqingBase";
import StatItem from "../../../Stats/StatItem";
import StatOccupationItem from "../../../Stats/StatOccupationItem";
import Efni from "../../Items/Efni/Efni";
import Gear from "../../Items/Gear/Gear";
import Rarity from "../../Rarity";
import RecipeEfni from "./RecipeEfni";
import RecipeRaw from "./RecipeRaw";
import RecipeResult from "./RecipeResult";
import RecipeStatus from "./RecipeStatus";

export default abstract class Recipe<T extends Gear> extends KeqingBase {
	constructor(keqing: Keqing, raw: RecipeRaw) { super(keqing); this.Install(raw); }
	protected Install(raw: RecipeRaw) {
		this._id = raw.id || this.GenerateUid(5);

		this._name = raw.name;
		this._description = raw.description;
		this._level = raw.level;
		this._rare = raw.rare;
		this._duration = raw.duration;

		if (raw.occupation) this._occupation = raw.occupation;
		if (raw.enhancer) this._enhancer = raw.enhancer;

		this._recipe = raw.recipe;
	}
	public Raw() {
		var raw: RecipeRaw = {
			id: this._id,
			struct: this.constructor.name,

			name: this._name,
			description: this._description,
			level: this._level,
			rare: this._rare,
			duration: this._duration,

			recipe: this._recipe
		}

		if (this._occupation) raw['occupation'] = this._occupation;
		if (this._enhancer) raw['enhancer'] = this._enhancer;

		return raw;
	}
	private GenerateUid(length: number) {
		var result = '';
		var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	private _id: string;
	private _name: string;
	private _description: string;
	private _level: number;
	private _rare: Rarity;
	private _duration: number;

	private _occupation?: string;
	private _enhancer?: string;

	private _recipe: RecipeEfni[];

	public get Id() { return this._id; }
	public get Name() { return this._name; }
	public get Description() { return this._description; }
	public get Level() { return this._level; }
	public get Rare() { return this._rare; }
	public get Duration() { return this._duration; }

	public get Occupation() { return this._occupation || ''; }
	public get Enhancer() { return this._enhancer || 'unknown'; }

	public get Recipe(): RecipeEfni[] { return new Array(...this._recipe); }

	public get PatentCost() {
		return (
			1_000_000 + //default cost
			100_000 + //name cost
			50_000 + //description cost
			(Rarity.rarityIndex[this._rare] * 500_000) +
			((this._duration / 100) * 100_000) +
			(this._level * 10_000) +
			(this._occupation ? 100_000 : 0) +
			(this._enhancer !== 'unknown' ? 100_000 : 0) +
			(this._recipe.length * 100_000)
		);
	}
	public get CreateCost() {
		return (
			10_000 + //name cost
			5_000 + //description cost
			(Rarity.rarityIndex[this._rare] * 100_000) +
			((this._duration / 100) * 10_000) +
			(this._level * 10_000) +
			(this._occupation ? 10_000 : 0) +
			(this._enhancer ? 50_000 : 0) +
			(this._recipe.length * 10_000)
		);
	}

	public Combine(items: Efni[], user: UserData): RecipeResult<T> {
		if (items.length !== this.Recipe.length) return { status: RecipeStatus.Efni_Lack };
		else {
			try {
				var recips = this.Recipe;
				var recipes: Efni[] = [];
				for (var efni of items) {
					var index = recips.findIndex(e => efni.Same(e));
					if (index === -1) return { status: RecipeStatus.Efni_Invaild };
					else {
						recips.splice(index, 1);
						recipes.push(efni);
					}
				}
				var stats = recipes.map(e => e.Stat);
				var statr: StatItem = stats.length < 2 ? stats[0] : stats.reduce((p, n) => StatItem.Merge(p, n));
				var stat: StatItem = {};
				var keys = this.StatKey();
				for (var k of keys) if (statr[k]) stat[k] = statr[k];

				var occstats = recipes.map(e => e.OccStat);
				var occstat: StatOccupationItem<any> = { occupation: this.Occupation };
				if (this.Occupation) {
					for (var occst of occstats) {
						for (var key in occst) {
							if (key === 'occupation') continue;
							else isNumber(occstat[key]) ? (occstat[key] ? occstat[key] += occst[key] : occstat[key] = occst[key]) : occstat[key] = occst[key];
						}
					}
				}
				return { status: RecipeStatus.Confirm, result: this.Create(user, stat, occstat) };
			}
			catch (e) {
				this.Qurare.Error(e);
			}
		}
	}
	protected abstract Create(user: UserData, stat: StatItem, occstat?: StatOccupationItem<any>): T;
	protected abstract StatKey(): (keyof StatItem)[];

	public Feed() {
		return this.Karin.Feed('레시피정보').TextFull(true).Text({
			T: `[${Rarity.rarityKo[this.Rare]}]${this.Occupation ? `[${this.Occupation}전용]` : ''} ${this.Name} (Lv.${this.Level})\r\n[${this.constructor.name}](UID:${this.Id})`,
			D: `${this.Description}\r\n내구도: ${this.Duration} | 강화: ${this.Enhancer === 'unknown' ? '강화불가' : `${this.Enhancer}계열`}`
		});
	}
	public Recipes() {
		return this.Karin.Carousel<Feed>(CustomType.FEED, '레시피목록').add(...this.Recipe.map(e => this.Karin.Feed('').TextFull(true).Text({
			T: `[${Rarity.rarityKo[e.rare]}]${e.name} (Lv.${e.level || 0})`,
			D: `${e.desc}\r\nMATID:${e.matid}`
		})));
	}
}