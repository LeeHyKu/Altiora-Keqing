import { ChatChannel, ChatUser, FeedChat, OpenKickFeed } from "node-kakao";
import Keqing from "../../Core/Keqing";
import KeqingAttachment from "../../Core/KeqingAttachment";
import FenrirCommand from "./Commands/FenrirCommand";
import FenrirHider from "./Commands/FenrirHider";
import FenrirKicker from "./Commands/FenrirKicker";
import FenrirSKicker from "./Commands/FenrirSKicker";
import Fenrir from "./Component/Fenrir";

export default <KeqingAttachment>{
	command: [
		FenrirCommand,
		FenrirHider,
		FenrirKicker,
		FenrirSKicker,
	],
	afterIgnition: async (keqing: Keqing) => {
		keqing.Client.on('user_kicked', async (channel: ChatChannel, user: ChatUser, feed?: FeedChat<OpenKickFeed>) => {
			try { await (await keqing.Citius.Channel.Find(channel)).GetComponent(Fenrir).IssueKicked(channel, user, feed); } catch (e) { keqing.Qurare.Error(e); }
		});
	}
}