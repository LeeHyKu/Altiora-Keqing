import Keqing from "../../Keqing";
import Command from "./Command";

export default interface CommandCS { new(keqing: Keqing): Command; }