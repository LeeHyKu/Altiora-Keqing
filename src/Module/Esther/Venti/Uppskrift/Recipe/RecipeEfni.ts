import Rarity from "../../Rarity";

export default interface RecipeEfni {
	name: string;
	desc: string;
	matid: string;
	level: number;
	rare: Rarity;
	excitem?: string;
	occupation?: string;
}