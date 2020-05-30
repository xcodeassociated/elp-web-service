export interface Event {
  id: string;
  uuid: String;
  createdDate: Number;
  version: Number;
  lastModifiedDate: Number;
  createdBy: String;
  modifiedBy: String;
  // model data:
  title: string;
  description: string,
  location: {
    latitude: string,
    longitude: string
  }
}
