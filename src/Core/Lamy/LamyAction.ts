import KeqingBase from "../KeqingBase";
import LamyConnection from "./LamyConnection";
import LamyInputs from "./LamyInputs";

export default abstract class LamyAction<T extends keyof LamyInputs> extends KeqingBase {
	public eventname: T;
	public abstract Action(arg: LamyInputs[T]['inbound'], connection: LamyConnection): LamyInputs[T]['outbound'] | Promise<LamyInputs[T]['outbound']>;
}