import KeqingAttachment from "../../Core/KeqingAttachment";
import ShiritoriCommand from "./Commands/ShiritoriCommand";
import ShiritoriInput from "./Commands/ShiritoriInput";
import Wordmap from "./Wordmap";

export default <KeqingAttachment>{
	command: [
		ShiritoriCommand,
		ShiritoriInput
	],
	afterIgnition: async keqing => {
		await keqing.Citius.GetSingleton(Wordmap).Ignition();
	}
}