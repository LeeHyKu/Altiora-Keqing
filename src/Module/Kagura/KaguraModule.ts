import KeqingAttachment from "../../Core/KeqingAttachment";
import KaguraChatEvent from "./ChatEvent/KaguraChatEvent";
import KaguraRanking from "./Commands/KaguraRanking";

export default <KeqingAttachment>{
	command: [
		KaguraRanking
	],
	chatEvent: [
		KaguraChatEvent
	]
}