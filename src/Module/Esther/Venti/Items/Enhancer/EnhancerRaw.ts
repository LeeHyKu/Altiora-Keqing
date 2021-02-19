import ItemRaw from "../../ItemRaw";
import EnhanceScale from "./EnhanceScale";

export default interface EnhancerRaw extends ItemRaw {
	ehid: string;
	surt: [number, number, number, number, number, number, number, number, number, number];
	scale: EnhanceScale | [EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale];
}