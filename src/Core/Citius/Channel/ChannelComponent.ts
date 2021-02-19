import Component from "../base/Component";
import ComponentRaw from "../ComponentRaw";
import ChannelData from "./ChannelData";
import ChannelQuery from "./ChannelQuery";
import ChannelSchema from "./ChannelSchema";
import ChannelTable from "./ChannelTable";

export default abstract class ChannelComponent<T extends ComponentRaw> extends Component<T, ChannelQuery, ChannelSchema, ChannelData, ChannelTable> { }