import KeqingAttachment from "../../Core/KeqingAttachment";
import OdinAttackCommand from "./Command/OdinAttackCommand";
import OdinDuelCommand from "./Command/OdinDuelCommand";

export default <KeqingAttachment>{
	command: [
		OdinAttackCommand,
		OdinDuelCommand
	]
}