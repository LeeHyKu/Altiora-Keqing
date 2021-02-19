import ComponentRaw from "../../../../Core/Citius/ComponentRaw";
import ChatsPerDay from "../ChatsPerDay";

export default interface KaguraUserRaw extends ComponentRaw {
	chats: ChatsPerDay[];
}