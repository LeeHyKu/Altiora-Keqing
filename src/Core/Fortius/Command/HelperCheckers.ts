import OccupationOnly from "../../../Module/Esther/Checker/OccupationOnly";
import BlackTags from "./Checkers/BlackTags";
import ForManagers from "./Checkers/ForManagers";
import ForTrustManagers from "./Checkers/ForTrustManager";
import OpenChatOnly from "./Checkers/OpenChatOnly";
import RequireManager from "./Checkers/RequireManager";
import WhiteTags from "./Checkers/WhiteTags";
import EssentialChecker from "./EssentialCheckers";

const HelperCheckers = [
	...EssentialChecker,
	ForManagers,
	ForTrustManagers,
	OpenChatOnly,
	RequireManager,
	BlackTags,
	WhiteTags,
	OccupationOnly
]
export default HelperCheckers;