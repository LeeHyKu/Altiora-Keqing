import KeqingAttachment from "../../Core/KeqingAttachment";
import EricaAttandance from "./Commands/EricaAttandance";
import EricaManagement from "./Commands/EricaManagement";
import EricaProfile from "./Commands/EricaProfile";
import EricaRemit from "./Commands/EricaRemit";
import EricaChatExp from "./SyncChat/EricaChatExp";

export default <KeqingAttachment>{
	command: [
		EricaProfile,
		EricaAttandance,
		EricaRemit,
		EricaManagement
	],
	syncchat: [
		EricaChatExp
	]
};