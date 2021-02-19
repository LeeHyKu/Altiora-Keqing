import KeqingAttachment from "../KeqingAttachment";
import Delete from "./Commands/Delete";
import Help from "./Commands/Help";
import Info from "./Commands/Info";
import Join from "./Commands/Join";
import Notice from "./Commands/Notice";
import Setting from "./Commands/Setting";
import Simulate from "./Commands/Simulate";
import Tag from "./Commands/Tag";
import Term from "./Commands/Term";

export default <KeqingAttachment>{
	command: [
		Delete,
		Info,
		Help,
		Setting,
		Simulate,
		Term,
		Notice,
		Tag,
		Join
	],
}