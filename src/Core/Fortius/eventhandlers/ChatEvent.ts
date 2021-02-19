import Event from "./Event";

export default abstract class ChatEvent extends Event<'message'> { }