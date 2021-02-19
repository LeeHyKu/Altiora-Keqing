import { FilterQuery } from "mongodb";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import ChannelSchema from "../../../../Core/Citius/Channel/ChannelSchema";
import ChannelSorter from "../../../../Core/Citius/Channel/ChannelSorter";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import KaguraChannel from "../../Component/Channel/KaguraChannel";

export default class ChannelChatSagaSorter extends ChannelSorter {
    protected BaseFilter(): FilterQuery<SchemaMarge<ChannelSchema>> {
        return {
			"component.KaguraChannel.chats": {
				$elemMatch: {
					index: {
						$gt: 0
					}
				}
			}
		}
    }
	protected LocalFilter(): (e: ChannelData) => boolean {
		return e => e.GetComponent(KaguraChannel).TotalIndex > 0;
    }
	protected Sort(): (pre: SchemaMarge<ChannelSchema>, next: SchemaMarge<ChannelSchema>) => number {
		var map = e => e.index;
		var reduce = (p, n) => p + n;
		return (pre, next) =>
			next.component['KaguraChannel']['chats'].map(map).reduce(reduce) -
			pre.component['KaguraChannel']['chats'].map(map).reduce(reduce);
    }
}