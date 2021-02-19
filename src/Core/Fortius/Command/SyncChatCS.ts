import Keqing from "../../Keqing";
import SyncChat from "./SyncChat";

export default interface SyncChatCS { new(keqing: Keqing): SyncChat; }