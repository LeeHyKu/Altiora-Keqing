import Component from "../base/Component";
import ComponentRaw from "../ComponentRaw";
import UserData from "./UserData";
import UserQuery from "./UserQuery";
import UserSchema from "./UserSchema";
import UserTable from "./UserTable";

export default abstract class UserComponent<T extends ComponentRaw> extends Component<T, UserQuery, UserSchema, UserData, UserTable> { }