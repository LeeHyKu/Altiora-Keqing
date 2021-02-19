import ItemIS from "../Venti/ItemIS";
import RecipeRaw from "../Venti/Uppskrift/Recipe/RecipeRaw";

export default interface InventoryRaw {
	items: ItemIS[];
	recipes: RecipeRaw[];
}