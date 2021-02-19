import ChannelBanned from "./Checkers/ChannelBanned";
import CheckTags from "./Checkers/CheckTags";
import Cooltime from "./Checkers/Cooltime";

const EssentialChecker = [
	CheckTags,
	Cooltime,
	ChannelBanned
]
export default EssentialChecker;