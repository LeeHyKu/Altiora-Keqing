import { Chat } from "node-kakao";
import ChannelData from "../../../../../Core/Citius/Channel/ChannelData";
import Item from "../../Item";
import ItemRaw from "../../ItemRaw";
import ArtifactStatus from "./ArtifactStatus";

export default abstract class Artifact<T extends ItemRaw> extends Item<T> {
	public abstract Use(chat: Chat, channel: ChannelData): ArtifactStatus | Promise<ArtifactStatus>;
	//public abstract UseBattle(chat: Chat, channel: ChannelData, /* TODO: Battle */): ArtifactStatus | Promise<ArtifactStatus>;
}