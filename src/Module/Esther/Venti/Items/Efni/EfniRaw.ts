import StatItem from "../../../Stats/StatItem";
import StatOccupationItem from "../../../Stats/StatOccupationItem";
import ItemRaw from "../../ItemRaw";

export default interface EfniRaw extends ItemRaw {
	level: number;
	stat: StatItem,
	excitem?: string,
	occupation?: string,
	occstat?: StatOccupationItem<any>
}