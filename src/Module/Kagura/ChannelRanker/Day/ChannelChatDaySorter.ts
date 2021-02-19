import { FilterQuery } from "mongodb";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import ChannelSchema from "../../../../Core/Citius/Channel/ChannelSchema";
import ChannelSorter from "../../../../Core/Citius/Channel/ChannelSorter";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import KaguraChannel from "../../Component/Channel/KaguraChannel";

export default class ChannelChatDaySorter extends ChannelSorter {
	protected BaseFilter(): FilterQuery<SchemaMarge<ChannelSchema>> {
		return {
			"component.KaguraChannel.chats": {
				$elemMatch: {
					date: {
						$gte: this.Today
					},
					index: {
						$gt: 0
					}
				}
			}
		};
	}
	protected LocalFilter(): (e: ChannelData) => boolean {
		return e => e.GetComponent(KaguraChannel).TodayIndex > 0;
	}
	protected Sort(): (pre: SchemaMarge<ChannelSchema>, next: SchemaMarge<ChannelSchema>) => number {
		var find = e => e.date.toDateString() === new Date().toDateString();

		return (pre, next) =>
			next.component['KaguraChannel']['chats'].find(find).index -
			pre.component['KaguraChannel']['chats'].find(find).index
	}

	private get Today() { return new Date(new Date().toDateString()); }
}