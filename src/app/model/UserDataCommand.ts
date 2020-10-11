import {Category} from "./Category";

export interface IUserDataCommand {
  maxDistance: number
  preferredCategories: Array<Category>
}

export class UserDataCommand implements IUserDataCommand {
  maxDistance: number
  preferredCategories: Array<Category>

  constructor(maxDistance: number, userPreferredCategories: Array<Category>) {
    this.maxDistance = maxDistance;
    this.preferredCategories = userPreferredCategories;
  }
}
