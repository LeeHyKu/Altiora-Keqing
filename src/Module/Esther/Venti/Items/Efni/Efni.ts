import StatItem from "../../../Stats/StatItem";
import StatOccupationItem from "../../../Stats/StatOccupationItem";
import RecipeEfni from "../../Uppskrift/Recipe/RecipeEfni";
import Material from "../Material/Material";
import EfniRaw from "./EfniRaw";

export default class Efni extends Material<EfniRaw>{
	protected Structor() { return Efni; }

	private _level: number;
	private _stat?: StatItem;
	private _excitem?: string;
	private _occupation?: string;
	private _occstat?: StatOccupationItem<any>;
	public get Level() { return this._level; }
	public get Stat(): StatItem { return this._stat || {}; }
	public get Excitem() { return this._excitem || ''; }
	public get Occupation() { return this._occupation || ''; }
	public get OccStat(): StatOccupationItem<any> { return this._occstat || { occupation: '' }; }

	protected OnInital(raw: EfniRaw) {
		this._level = raw.level;
		this._stat = raw.stat;
		if (raw.excitem) this._excitem = raw.excitem;
		if (raw.occupation) this._occupation = raw.occupation;
		if (raw.occstat) this._occstat = raw.occstat;
	}
	protected OnExport() {
		var raw: EfniRaw = { level: this._level, stat: this._stat };
		if (this._excitem) raw['excitem'] = this._excitem;
		if (this._occupation) raw['occupation'] = this._occupation;
		if (this._occstat) raw['occstat'] = this._occstat;
		return raw;
	}

	public get toRecipeEfni(): RecipeEfni {
		return {
			name: this.Name,
			desc: this.Description,
			level: this.Level,
			matid: this.Matid,
			rare: this.Rareity,
			occupation: this.Occupation,
			excitem: this.Excitem,
		}
	}
	public Same(recipe: RecipeEfni) {
		return this.Level === recipe.level && this.Matid === recipe.matid && this.Rareity === recipe.rare && this.Occupation === recipe.occupation && this.Excitem === recipe.excitem
	}
}