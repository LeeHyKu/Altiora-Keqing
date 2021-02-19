import KeqingAttachment from "../../../../Core/KeqingAttachment";
import RecipeCS from "./Recipe/RecipeCS";
import WeaponRecipes from "./Recipe/Recipes/WeaponRecipes";
import Uppskrift from "./Uppskrift";
import UppskriftAliases from "./UppskriftAliases";

const Recipes: RecipeCS[] = [
	WeaponRecipes,
];
const RecipeAliases: UppskriftAliases[] = [
	{ alias: '전투', struct: 'WeaponRecipes' }
];
export default <KeqingAttachment>{
	afterIgnition: async keqing => {
		var upp = keqing.Citius.GetSingleton(Uppskrift);
		upp.Attach(...Recipes);
		upp.AttachAliases(...RecipeAliases);
	}
}