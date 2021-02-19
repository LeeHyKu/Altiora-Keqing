import { CustomType } from "node-kakao";
import UserData from "../../../../../Core/Citius/User/UserData";
import UserTemp from "../../../../../Core/Citius/User/UserTemp";
import Feed from "../../../../../Core/Karin/Contents/Feed/Feed";
import Keqing from "../../../../../Core/Keqing";
import Erica from "../../../../Erica/Component/Erica";
import Efni from "../../Items/Efni/Efni";
import Beata from "../../Items/Enhancer/Beata";
import Rarity from "../../Rarity";
import Uppskrift from "../Uppskrift";
import RecipeCS from "./RecipeCS";
import RecipeEfni from "./RecipeEfni";
import RecipeRaw from "./RecipeRaw";
import UppskriftError from "./UppskriftError";

export default class RecipeBuilder extends UserTemp {
	private _timer: NodeJS.Timeout;
	constructor(keqing: Keqing, user: UserData) {
		super(keqing, user);
		this._timer = setTimeout(() => { if (this.Data.HasTemp(RecipeBuilder)) { this.Data.DelTemp(RecipeBuilder); this.Data.CheckSave(); } }, 1200000);
	}

	private struct: RecipeCS;

	private name: string;
	private description: string;
	private duration: number;

	private enhancer?: string;

	private reci: Efni[] = [];
	private get recipe() { return this.reci.map(e => e.toRecipeEfni); }

	public get Occupation() { return this.recipe.find(e => e.occupation)?.occupation || ''; }
	private get Level() { return this.recipe.sort((p, n) => n.level - p.level)[0]?.level || 1; }
	private get Rare() { return <Rarity>Rarity.rarityIndexR[this.recipe.map(e => Rarity.rarityIndex[e.rare]).sort((p, n) => p - n)[0] || 0]; }

	public Name(n: string) {
		if (n.length > 15) throw new UppskriftError('이름은 15바이트 이내여야 합니다');
		else if (n.length < 1) throw new UppskriftError('이름을 입력해주세요');
		else { this.name = n; return this; }
	}
	public Desc(d: string) {
		if (d.length > 100) throw new UppskriftError('설명은 100바이트 이내여야 합니다');
		else if (d.length < 1) throw new UppskriftError('설명을 입력해주세요');
		else { this.description = d; return this; }
	}
	public Duration(t: number) {
		if (t < 100) throw new UppskriftError('내구도는 최소 100 이상이어야 합니다');
		else { this.duration = t; return this; }
	}
	public ItemType(t: string) {
		var struct = this.Citius.GetSingleton(Uppskrift).GetByAliases(t);
		if (!struct) throw new UppskriftError('알 수 없는 아이템타입입니다');
		else if (this.recipe.some(e => e.excitem && e.excitem !== struct.name)) throw new UppskriftError('레시피와 충돌이 있습니다 : 전용아이템타입');
		else { this.struct = struct; return this; }
	}
	public Enhancer(beata: string) {
		if (!this.Citius.GetSingleton(Beata).IsBeata(beata)) throw new UppskriftError('알 수 없는 인첸트타입입니다');
		else { this.enhancer = beata; return this; }
	}
	public Recipe(efni: Efni) {
		if (efni.Occupation && this.Occupation && this.Occupation !== efni.Occupation) throw new UppskriftError('레시피와 충돌이 있습니다 : 전용직업타입');
		else if (efni.Excitem && this.recipe.some(e => e.excitem && e.excitem !== efni.Excitem)) throw new UppskriftError('레시피와 충돌이 있습니다 : 전용아이템타입');
		else { this.reci.push(efni); return this; }
	}

	public Goable() { return this.struct && this.name && this.description && this.duration && this.reci.length > 1 }
	public Go() {
		if (!this.Goable()) throw new UppskriftError('아직 레시피가 완성되지 않았습니다');
		else {
			var raw: RecipeRaw = {
				struct: this.struct.name,

				name: this.name,
				description: this.description,
				duration: this.duration,
				level: this.Level,
				rare: this.Rare,

				recipe: this.recipe,
			};

			if (this.Occupation) raw['occupation'] = this.Occupation;
			if (this.enhancer) raw['enhancer'] = this.enhancer;

			clearTimeout(this._timer);
			this.Data.DelTemp(RecipeBuilder);

			return new this.struct(this.Keqing, raw);
		}
	}

	public Status() {
		return this.Karin.Feed('레시피제작상태').TextFull(true).Text({
			T: `[${Rarity.rarityKo[this.Rare || Rarity.NORMAL]}]${this.name || '이름없음'} (Lv.${this.Level})\r\n${this.Occupation ? `[${this.Occupation}전용]` : ''}`,
			D: `${this.description || '설명없음'}\r\n내구도: ${this.duration || '미정'} | 강화: ${this.enhancer ? `${this.enhancer}계열` : '미정'}\r\n레시피 개수: ${this.recipe.length} | ${this.Goable() ? '완성' : '미완성'}`
		});
	}
	public Recipes() {
		return this.Karin.Carousel<Feed>(CustomType.FEED, '레시피목록').add(...this.reci.map(e => e.Feed()));
	}
}