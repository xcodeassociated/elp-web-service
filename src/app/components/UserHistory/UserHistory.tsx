import React, {Component} from 'react'
import {Redirect} from "react-router-dom"
import {connect} from 'react-redux'
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact'
import {EventWithCategory} from "../../model/EventWithCategory"
import { Page } from "../../model/Page"
import "../../style/Event.css"
import {Category} from "../../model/Category";
import {deregister, fetchUserHistory} from "../../services/UserHistoryService";
import {optional} from "../../model/Types";
import {UserEvent} from "../../model/UserEvent";
import {hasToken} from "../../services/TokenService";

type Error = {
  code: number,
  description: string
}

interface IState {
  events?: Array<EventWithCategory>,
  error?: Error,
  eventDeleteId: string,
  initDispatch: Function,
  dispatch: Function
}

interface IProp {
  isRedirectHome: boolean
}

class Events extends Component<IProp, IState> {

  constructor(props: IProp) {
    super(props)
    this.state = {
      events: undefined,
      error: undefined,
      eventDeleteId: "",
      initDispatch: () => {
        this.getAllEvents()
      },
      dispatch: () => {}
    }
  }

  public componentDidMount(): void {
    this.state.initDispatch()
  }

  private onDeleteSubmit(id: string): void {
    this.setState({...this.state, eventDeleteId: id})
    this.state.dispatch(this.delete(id))
  }

  private clearDelete(): void {
    this.setState({
      ...this.state,
      eventDeleteId: ""
    })
  }

  private getAllEvents(): void {
    const onFetchEvents = (response: Response): void => {
      if (response.ok) {
        response.text().then(data => {
          let page: Page<UserEvent> = JSON.parse(data)
          if (page.content != null) {
              let objects: Array<UserEvent> = page.content
              this.setState({
                ...this.state,
                events: objects.map((e: UserEvent) => e.eventDto)
              })
            }
          }
        )
      } else {
        response.text().then(text => {
          this.setState({
            ...this.state,
            error: {
              code: response.status,
              description: text
            }
          })
        })
      }
    }

    let eventPromise: optional<Promise<Response>> = fetchUserHistory()
    if (eventPromise != null) {
      eventPromise.then(onFetchEvents)
    }
  }

  private delete(id: string): void {
    let eventPromise: optional<Promise<Response>> = deregister(id)
    if (eventPromise != null) {
      eventPromise.then((response: Response) => {
        if (response.ok) {
          this.getAllEvents()
        } else {
          console.error("error: request returned non-ok response: " + JSON.stringify(response))
          this.clearDelete()
        }
      }).catch((error: any) => console.error(error))
    } else {
      console.error("error: deleteEvent promise null")
      this.clearDelete()
    }
  }

  public render() {
    if (this.props.isRedirectHome) {
      return (
        <Redirect to='/' />
      )
    } else {
      if (hasToken() && this.state.error === undefined) {
        return (
          <div id="reservations-list">
            <MDBTable>
              <MDBTableHead>
                <tr className="events-list-table-header">
                  <th className="events-list-table-header-id">ID</th>
                  <th className="events-list-table-header-title">Title</th>
                  <th className="events-list-table-header-description">Description</th>
                  <th className="events-list-table-header-category">Category</th>
                  <th className="events-list-table-header-start">Start</th>
                  <th className="events-list-table-header-stop">Stop</th>
                  <th className="events-list-table-header-coordinate">Latitude</th>
                  <th className="events-list-table-header-coordinate">Longitude</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {this.state.events !== undefined ?
                  this.state.events
                    .map((event: EventWithCategory, index: number) =>
                      <tr key={index} className="reservation-item">
                        <td>{event.id}</td>
                        <td>{event.title}</td>
                        <td>{event.description}</td>
                        <td>{(event.categories) ? event.categories.map((e: Category) => e.title + " ") : ''}</td>
                        <td>{(event.start) ? new Date(event.start).toLocaleString() : ''}</td>
                        <td>{(event.stop) ? new Date(event.stop).toLocaleString() : ''}</td>
                        <td>{event.location[0]}</td>
                        <td>{event.location[1]}</td>
                        <td>
                          {(event.stop && event.stop >= Date.now()) ?
                            <button className="btn btn-danger"
                                    onClick={() => this.onDeleteSubmit(event.id)}>Leave</button>
                            : null
                          }
                        </td>
                      </tr>)
                  : null
                }
              </MDBTableBody>
            </MDBTable>
          </div>
        )
      } else {
        return (
          <div id="reservations-error">
            <div id="reservations-error-code">
              <h2>
                {this.state.error !== undefined ?
                  this.state.error.code
                  : null}
              </h2>
            </div>
            <div id="reservations-error-description">
              <p>
                {this.state.error !== undefined ?
                  this.state.error.description
                  : null}
              </p>
            </div>
          </div>
        )
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(Events)
