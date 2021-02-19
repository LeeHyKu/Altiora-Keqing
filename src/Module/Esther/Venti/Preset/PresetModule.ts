import KeqingAttachment from "../../../../Core/KeqingAttachment";
import ItemIS from "../ItemIS";
import BearTendon from "./Items/Efni/BearTendon";
import FishBreath from "./Items/Efni/FishBreath";
import TestEnhancer from "./Items/Enhancer/TestEnhancer";
import TestGear from "./Items/Gear/TestGear";
import SecuritiesTemp from "./Items/SecuritiesTemp";
import Gungnir from "./Items/Weapon/Gungnir";
import Preset from "./Preset";

const preset: ItemIS[] = [
	TestGear,
	TestEnhancer,
	Gungnir,
	BearTendon,
	FishBreath,
	SecuritiesTemp
];
export default <KeqingAttachment>{
	afterIgnition: keqing => keqing.Citius.GetSingleton(Preset).Attach(...preset)
};