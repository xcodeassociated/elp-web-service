export interface IUserDataCommand {
  maxDistance: number
  userPreferredCategories: Array<String>
}

export class UserDataCommand implements IUserDataCommand {
  maxDistance: number
  userPreferredCategories: Array<String>

  constructor(maxDistance: number, userPreferredCategories: Array<String>) {
    this.maxDistance = maxDistance;
    this.userPreferredCategories = userPreferredCategories;
  }
}
