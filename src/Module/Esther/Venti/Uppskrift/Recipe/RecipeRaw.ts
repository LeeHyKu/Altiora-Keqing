import Rarity from "../../Rarity";
import RecipeEfni from "./RecipeEfni";

export default interface RecipeRaw {
	id?: string;
	struct: string;

	name: string;
	description: string;
	level: number;
	rare: Rarity;
	duration: number;

	occupation?: string;
	enhancer?: string;

	recipe: RecipeEfni[];
}