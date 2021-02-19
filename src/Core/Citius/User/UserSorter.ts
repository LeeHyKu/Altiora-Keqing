import Sorter from "../base/Sorter";
import UserData from "./UserData";
import UserQuery from "./UserQuery";
import UserSchema from "./UserSchema";
import UserTable from "./UserTable";

export default abstract class UserSorter extends Sorter<UserQuery, UserSchema, UserData, UserTable>{ }