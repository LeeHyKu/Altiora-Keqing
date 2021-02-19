import Sorter from "../base/Sorter";
import ChannelData from "./ChannelData";
import ChannelQuery from "./ChannelQuery";
import ChannelSchema from "./ChannelSchema";
import ChannelTable from "./ChannelTable";

export default abstract class ChannelSorter extends Sorter<ChannelQuery, ChannelSchema, ChannelData, ChannelTable>{ }