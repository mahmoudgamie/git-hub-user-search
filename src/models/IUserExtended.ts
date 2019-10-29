import IUser from "./IUser";

export default interface IUserExtended extends IUser {
  name: string;
  location: string;
  followers: number;
}
