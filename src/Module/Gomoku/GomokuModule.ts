import KeqingAttachment from "../../Core/KeqingAttachment";
import GomokuCommand from "./Commands/GomokuCommand";
import GomokuInput from "./Commands/GomokuInput";

export default <KeqingAttachment>{
	command: [
		GomokuCommand,
		GomokuInput
	]
};