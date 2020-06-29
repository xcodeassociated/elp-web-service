export interface ILocation {
  location: Array<Number>
}

export class Location implements ILocation {
  location: Array<Number>

  constructor(location: Array<Number>) {
    this.location = location
  }
}
