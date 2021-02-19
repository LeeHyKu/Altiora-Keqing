import Keqing from "../Keqing";
import KeqingBase from "../KeqingBase";

export default interface KeqingSingletonC<T extends KeqingBase> { new(keqing: Keqing): T; }