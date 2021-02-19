import Keqing from "../../Keqing";
import EventHandler from "./Eventhandler";

export default class ChatHandler extends EventHandler<'message'> { constructor(base: Keqing) { super(base, 'message'); } }