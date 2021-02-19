import { ObjectId } from "mongodb";
import Recipe from "../../Esther/Venti/Uppskrift/Recipe/Recipe";
import RecipeRaw from "../../Esther/Venti/Uppskrift/Recipe/RecipeRaw";

export interface SharedRecipe {
	whoshared: ObjectId;
	recipe: Recipe<any>;
}
export interface SharedRecipeRaw {
	whoshared: ObjectId;
	recipe: RecipeRaw;
}