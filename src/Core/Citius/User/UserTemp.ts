import DataTemp from "../base/DataTemp";
import UserData from "./UserData";
import UserQuery from "./UserQuery";
import UserSchema from "./UserSchema";

export default abstract class UserTemp extends DataTemp<UserQuery, UserSchema, UserData> { }