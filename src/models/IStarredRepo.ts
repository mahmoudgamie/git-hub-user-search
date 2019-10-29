import IRepo from "./IRepo";

export default interface IStarredRepo {
  repo: IRepo;
  starred_at: string;
}
