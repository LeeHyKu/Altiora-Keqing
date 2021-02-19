import Rarity from "./Rarity";

export default interface ItemRawDefault {
	uid?: string;
	name: string;
	description?: string;
	rarity: Rarity;
}