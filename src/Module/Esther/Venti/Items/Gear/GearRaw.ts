import StatItem from "../../../Stats/StatItem";
import StatOccupationItem from "../../../Stats/StatOccupationItem";
import ItemRaw from "../../ItemRaw";
import EnhanceScale from "../Enhancer/EnhanceScale";

export default interface GearRaw extends ItemRaw {
	level?: number;
	occupation?: string;

	maxdurability?: number;
	durability?: number; //automatic

	ehid?: string;
	enhance?: Array<EnhanceScale>;
	enhanceDur?: number;

	bonus?: StatItem;
	occbonus?: StatOccupationItem<any>;

	occpromote?: string;
	promotebonus?: StatItem;
}