import UserData from "../../../../../../Core/Citius/User/UserData";
import ForceType from "../../../../../Odin/Battle/ForceType";
import StatItem from "../../../../Stats/StatItem";
import StatOccupationItem from "../../../../Stats/StatOccupationItem";
import ItemRawM from "../../../ItemRawM";
import GearRawM from "../../../Items/Gear/GearRawM";
import Weapon from "../../../Items/Weapon/Weapon";
import WeaponRawM from "../../../Items/Weapon/WeaponRawM";
import Recipe from "../Recipe";

export default class WeaponRecipes extends Recipe<Weapon>{
	protected Create(user: UserData, stat: StatItem, occstat?: StatOccupationItem<any>): Weapon<{}> {
		var r: ItemRawM<GearRawM<WeaponRawM<{}>>> = {
			name: this.Name,
			description: this.Description,
			rarity: this.Rare,
			level: this.Level,
			maxdurability: this.Duration,
			bonus: stat,
			force: ForceType.PHYSIC_CUT
		};
		if (this.Occupation) r['occupation'] = this.Occupation;
		if (this.Enhancer) r['ehid'] = this.Enhancer;
		if (occstat) r['occbonus'] = occstat;
		return new Weapon(this.Keqing, user, r);
	}
	protected StatKey(): ("HP" | "AP" | "AGI" | "ATK" | "CRI" | "DEF" | "REG" | "HIT" | "FAT" | "PAN")[] {
		return ['ATK', 'CRI'];
	}
}