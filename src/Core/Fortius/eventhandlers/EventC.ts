import Keqing from "../../Keqing";
import Event from "./Event";
import Kevents from "./Kevents";

export default interface EventC<E extends keyof Kevents & string, T extends Event<E>> { new(base: Keqing): T; }