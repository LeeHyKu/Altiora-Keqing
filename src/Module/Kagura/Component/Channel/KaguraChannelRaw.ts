import ComponentRaw from "../../../../Core/Citius/ComponentRaw";
import ChatsPerDay from "../ChatsPerDay";

export default interface KaguraChannelRaw extends ComponentRaw {
	chats: ChatsPerDay[];
}