import KeqingAttachment from "../../Core/KeqingAttachment";
import BusterCall from "./Commands/BusterCall";
import Dev from "./Commands/Dev";
import Heart from "./Commands/Heart";
import MyInfo from "./Commands/MyInfo";

export default <KeqingAttachment>{
	command: [
		MyInfo,
		Heart,
		BusterCall,
		Dev
	]
};