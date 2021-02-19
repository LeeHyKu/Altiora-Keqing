import KeqingBase from "../../../../Core/KeqingBase";
import Recipe from "./Recipe/Recipe";
import RecipeC from "./Recipe/RecipeC";
import RecipeCS from "./Recipe/RecipeCS";
import UppskriftAliases from "./UppskriftAliases";

export default class Uppskrift extends KeqingBase {
	private structs: RecipeCS[] = [];
	private aliases: UppskriftAliases[] = [];
	public get Aliases() { return this.aliases; }
	public Attach(...structs: RecipeCS[]) { this.structs.push(...structs); }
	public AttachAliases(...aliases: UppskriftAliases[]) { this.aliases.push(...aliases); }
	public GetByName<T extends Recipe<any>>(name: string): RecipeC<any, T> { return <RecipeC<any, T>>this.structs.find(e => e.name === name); }
	public GetByAliases(name: string) {
		var ali = this.aliases.find(e => e.alias === name);
		if (!ali) return null;
		else return this.GetByName(ali.struct);
	}
}