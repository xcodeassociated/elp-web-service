import React, {Component} from "react";
import {connect} from 'react-redux';
import {Redirect} from "react-router-dom"
import {Category} from "../model/Category";
import Select from "react-dropdown-select"
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact'
import {fetchAllCategories} from "../services/CategoryService";
import {UserData} from "../model/UserData";
import {fetchUserData, saveUserData} from "../services/UserDataService";
import {UserDataCommand} from "../model/UserDataCommand";

interface ISettingsState {
  maxDistance: number
  preferredCategories: Array<Category>,
  categories: Array<Category>,
  redirect: boolean
}

interface ISettingsProps {
  isRedirectHome: boolean
}

class Settings extends Component<ISettingsProps, ISettingsState> {

  constructor(props: Readonly<ISettingsProps>) {
    super(props);
    this.state = {
      maxDistance: 0,
      preferredCategories: [],
      categories: [],
      redirect: false
    }
    setTimeout(() => this.fetchAndUpdateCategories(), 250);
    setTimeout(() => this.fetchAndUpdateUserData(), 250);
  }

  private fetchAndUpdateCategories(): void {
    this.getCategories()
      .then((categories: Array<Category>) => this.setState({...this.state, categories: categories}))
      .catch((error: Error) => console.log(error))
  }

  private async getCategories(): Promise<Array<Category>> {
    const response: Response | null = await fetchAllCategories()
    if (response && response.ok) {
      const data: string = await response.text()
      const categories: Array<Category>= JSON.parse(data)
      return categories
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private fetchAndUpdateUserData(): void {
    this.getUserData()
      .then((data: UserData) => this.setState({
        ...this.state,
        maxDistance: data.maxDistance,
        preferredCategories: data.preferredCategories
      }))
      .catch((error: Error) => alert("Please fill up settings data!"))
  }

  private async getUserData(): Promise<UserData> {
    const response: Response | null = await fetchUserData()
    if (response && response.ok) {
      const data: string = await response.text()
      return JSON.parse(data)
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private async updateUserData(userData: UserDataCommand ): Promise<UserData> {
    const response: Response | null = await saveUserData(userData)
    if (response && response.ok) {
      const data: string = await response.text()
      return JSON.parse(data)
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private onCreateOrUpdateSubmit(e: any): void {
    e.preventDefault()
    const userData: UserDataCommand = new UserDataCommand(this.state.maxDistance,
      this.state.preferredCategories.map((e: Category) => e.id))
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
      let {maxDistance, preferredCategories, categories} = this.state
      return (
        <div id="reservations-list">
          <div id="event-create-form">
            <MDBTable>
              <MDBTableBody>
                <tr>
                  <td className="reservations-list-table-header-create-event">
                    <form name="eventCreateForm" onSubmit={this.onCreateOrUpdateSubmit.bind(this)}>
                      <div className="form-group-collection">
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
