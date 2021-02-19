import CommandCS from "./Fortius/Command/CommandCS";
import SyncChatCS from "./Fortius/Command/SyncChatCS";
import ChatEvent from "./Fortius/eventhandlers/ChatEvent";
import EventC from "./Fortius/eventhandlers/EventC";
import Keqing from "./Keqing";
import LamyAction from "./Lamy/LamyAction";

export default interface KeqingAttachment {
	syncchat?: SyncChatCS[];
	command?: CommandCS[];
	lamies?: { new(keqing: Keqing): LamyAction<any> }[];
	chatEvent?: EventC<'message', ChatEvent>[];
	afterIgnition?: (keqing: Keqing) => Promise<any>;
	splashaction?: (keqing: Keqing) => Promise<any>;
}