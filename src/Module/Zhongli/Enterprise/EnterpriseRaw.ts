import { ObjectId } from "mongodb";
import RecipeRaw from "../../Esther/Venti/Uppskrift/Recipe/RecipeRaw";
import EnterpriseRank from "./EnterpriseRank";
import EStockRaw from "./EStock/EStockRaw";
import Product from "./Product";
import { SharedRecipeRaw } from "./SharedRecipe";

export default interface EnterpriseRaw {
	_id: ObjectId;
	name: string;
	description?: string;
	stname: string;
	rank: EnterpriseRank

	boss: ObjectId;
	employees: ObjectId[];
	maxemploy: number;

	sales: number;
	products: Product[];
	recipes: SharedRecipeRaw[];

	stock: EStockRaw;
}