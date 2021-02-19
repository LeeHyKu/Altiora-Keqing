import KeqingAttachment from "../../../Core/KeqingAttachment";
import Hermes from "./Hermes";
import AesirCommand from "./Occupations/Aesir/AesirCommand";
import Occupations from "./Occupations/Occupations";

export default <KeqingAttachment>{
	command: [
		AesirCommand
	],
	afterIgnition: async keqing => keqing.Citius.GetSingleton(Hermes).Attach(...Occupations)
};