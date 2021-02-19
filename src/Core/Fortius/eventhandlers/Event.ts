import KeqingBase from "../../KeqingBase";
import Kevents from "./Kevents";

export default abstract class Event<T extends keyof Kevents & string> extends KeqingBase { public abstract Execute(...args: Kevents[T]): Promise<any>; }