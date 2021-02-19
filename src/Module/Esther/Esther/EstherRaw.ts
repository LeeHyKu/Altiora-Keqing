import OccupationStatus from "../Occupation/OccupationStatus";
import StatItem from "../Stats/StatItem";
import Stats from "../Stats/Stats";
import ItemI from "../Venti/ItemI";
import ArmorRaw from "../Venti/Items/Armor/ArmorRaw";
import WeaponRaw from "../Venti/Items/Weapon/WeaponRaw";

export default interface EstherRaw {
	kill: number;
	death: number;

	extend?: StatItem;
	occupation: OccupationStatus;

	armor?: ItemI<ArmorRaw>
	weapon?: ItemI<WeaponRaw>;
}