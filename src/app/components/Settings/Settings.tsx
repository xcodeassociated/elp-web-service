import React, {Component} from "react";
import {connect} from 'react-redux';
import {Redirect} from "react-router-dom"
import {Category} from "../../model/Category";
import Select from "react-dropdown-select"
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact'
import {fetchAllCategories} from "../../services/CategoryService";
import {UserData} from "../../model/UserData";
import {fetchUserData, saveUserData} from "../../services/UserDataService";
import {UserDataCommand} from "../../model/UserDataCommand";
import {UserAccountContactData} from "../../model/UserAccountContactData";
import {optional} from "../../model/Types";
import {fetchUserAccountData, updateUserAccountData} from "../../services/UserAccountService";
import {UserAccountData} from "../../model/UserAccountData";
import {UserAccountDataCommand} from "../../model/UserAccountDataCommand";
import {Page} from "../../model/Page";

interface ISettingsState {
  firstName: optional<string>,
  lastName: optional<string>,
  authId: string,
  username: string,
  createdTimestamp: number,
  enabled: boolean,
  contacts: Array<UserAccountContactData>,
  maxDistance: number
  preferredCategories: Array<Category>,
  categories: Array<Category>,
  redirect: boolean,
  initDispatch: Function
}

interface ISettingsProps {
  isRedirectHome: boolean
}

class Settings extends Component<ISettingsProps, ISettingsState> {

  constructor(props: Readonly<ISettingsProps>) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      authId: '',
      username: '',
      createdTimestamp: 0,
      enabled: true,
      contacts: [],
      maxDistance: 0,
      preferredCategories: [],
      categories: [],
      redirect: false,
      initDispatch: () => {
        this.fetchAndUpdateCategories()
        this.fetchAndUpdateUserData()
      }
    }
  }

  public componentDidMount(): void {
    this.state.initDispatch()
  }

  private fetchAndUpdateCategories(): void {
    this.getCategories()
      .then((categories: Array<Category>) => this.setState({...this.state, categories: categories}))
      .catch((error: Error) => console.error(error))
  }

  private async getCategories(): Promise<Array<Category>> {
    const response: optional<Response> = await fetchAllCategories()
    if (response && response.ok) {
      const data: string = await response.text()
      const paged: Page<Category> = JSON.parse(data)
      const categories: Array<Category> = paged.content
      return categories
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private fetchAndUpdateUserData(): void {
    this.getUserAccountData()
      .then((data: UserAccountData) => this.setState({
        ...this.state,
        firstName: data.firstName,
        lastName: data.lastName,
        authId: data.authId,
        username: data.username,
        createdTimestamp: data.createdTimestamp,
        enabled: data.enabled,
        contacts: data.contacts,
      }))
      .catch((error: Error) => console.error(error))

    this.getUserData()
      .then((data: UserData) => this.setState({
        ...this.state,
        maxDistance: data.maxDistance,
        preferredCategories: data.preferredCategories
      }))
      .catch((error: Error) => alert("Please fill up settings data!"))
  }

  private async getUserData(): Promise<UserData> {
    const response: optional<Response> = await fetchUserData()
    if (response && response.ok) {
      const data: string = await response.text()
      return JSON.parse(data)
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private async getUserAccountData(): Promise<UserAccountData> {
    const response: optional<Response> = await fetchUserAccountData()
    if (response && response.ok) {
      const data: string = await response.text()
      return JSON.parse(data)
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private async updateUserData(userData: UserDataCommand): Promise<UserData> {
    const response: optional<Response> = await saveUserData(userData)
    if (response && response.ok) {
      const data: string = await response.text()
      return JSON.parse(data)
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private async updateUserAccountData(userAccountData: UserAccountDataCommand): Promise<boolean> {
    const response: optional<Response> = await updateUserAccountData(userAccountData)
    if (response && response.ok) {
      return true
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private onCreateOrUpdateSubmit(e: any): void {
    e.preventDefault()
    const userAccountData: UserAccountDataCommand = new UserAccountDataCommand(this.state.username,
      (this.state.firstName && this.state.firstName.length > 0) ? this.state.firstName : null,
      (this.state.lastName && this.state.lastName.length > 0) ? this.state.lastName : null, null)
    this.updateUserAccountData(userAccountData).then((result: boolean) => {
      if (result) {
        this.setState({...this.state, redirect: true})
      }
    })
      .catch((error: Error) => alert("Sorry, the data could not be saved"))

    const userData: UserDataCommand = new UserDataCommand(this.state.maxDistance, this.state.preferredCategories)
    this.updateUserData(userData).then((data: UserData) => this.setState({
      ...this.state,
      maxDistance: data.maxDistance,
      preferredCategories: data.preferredCategories,
      redirect: true
    }))
    .catch((error: Error) => alert("Sorry, the data could not be saved"))
  }

  private onResetSubmit(e: any): void {
    e.preventDefault()
    this.fetchAndUpdateUserData()
  }

  public render() {
    if (this.props.isRedirectHome || this.state.redirect) {
      return (
        <Redirect to='/'/>
      )
    } else {
      let {firstName, lastName, createdTimestamp, authId, contacts, maxDistance, preferredCategories, categories} = this.state
      return (
        <div id="reservations-list">
          <div id="event-create-form">
            <MDBTable>
              <MDBTableBody>
                <tr>
                  <td className="events-list-table-header-create-event">
                    <form name="eventCreateForm" onSubmit={this.onCreateOrUpdateSubmit.bind(this)}>
                      <div className="form-group-collection">
                        <div className="form-group">
                          <div className="form-group">
                            <label className="location-label">Auth Id:</label>
                            <input type="text" className="location-input" name="title"
                                   disabled={true}
                                   value={authId}/>
                          </div>
                          <label className="location-label">First Name:</label>
                          <input type="text" className="location-input" name="title"
                                 onChange={e => this.setState({...this.state, firstName: e.target.value})}
                                 value={(firstName) ? firstName : ''}/>
                        </div>
                        <div className="form-group">
                          <label className="location-label">Last Name:</label>
                          <input type="text" className="location-input" name="title"
                                 onChange={e => this.setState({...this.state, lastName: e.target.value})}
                                 value={(lastName) ? lastName : ''}/>
                        </div>
                        <div className="form-group">
                          <label className="location-label">Created Date:</label>
                          <input type="text" className="location-input" name="title"
                                 disabled={true}
                                 value={createdTimestamp}/>
                        </div>
                        <div className="form-group">
                          <label className="location-label">Email(s):</label>
                          <input type="text" className="location-input" name="title"
                                 disabled={true}
                                 value={contacts.map((e: UserAccountContactData) => e.email)}/>
                        </div>
                        <div className="form-group">
                          <label className="location-label">Max distance:</label>
                          <input type="text" className="location-input" name="title"
                                 onChange={e => this.setState({...this.state, maxDistance: Number(e.target.value)})}
                                 value={maxDistance}/>
                        </div>
                        <div className="form-group">
                          <label className="location-label">Event Categories:</label>
                          <Select options={categories}
                                  onChange={(values: Array<Category>) => this.setState({...this.state, preferredCategories: values})}
                                  values={preferredCategories} labelField={"title"} valueField={"id"} multi={true} key={"id"} />
                        </div>
                      </div>
                      <div className="form-group">
                        <button className="btn btn-info">Update</button>
                        <button className="btn btn-default" onClick={this.onResetSubmit.bind(this)}>Reset</button>
                      </div>
                    </form>
                  </td>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  };
};

export default connect(mapStateToProps)(Settings)
