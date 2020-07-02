import React, {Component} from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet"
import { Icon } from "leaflet"
import "../style/App.css"
import "../style/Home.css"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'
import { GeolocatedProps, geolocated } from "react-geolocated"
import {fetchAllActiveEvents, fetchAllRecommendedEvents, searchEvents} from "../services/EventService"
import { Page } from "../model/Page"
import { EventWithCategory } from "../model/EventWithCategory"
import {eventSearch, EventSearch} from "../model/EventSearch"
import {fetchAllCategories} from "../services/CategoryService"
import {Category} from "../model/Category"
import {Location} from "../model/Location"
import {arrayOptional, optional} from "../model/Types"
import NumericInput from 'react-numeric-input'
import Switch from "react-switch"
import {deregister, register} from "../services/UserHistoryService";
import {hasToken} from "../services/TokenService";
import Select from "react-dropdown-select";
import {fetchAllSpots} from "../services/SpotService";
import {Spot} from "../model/Spot";

export const icon = new Icon({
  iconUrl: "/location.svg",
  iconSize: [25, 25]
})

export const userIcon = new Icon({
  iconUrl: "/user.svg",
  iconSize: [25, 25]
})

interface EventWrapper {
  item: EventWithCategory,
  referance: optional<any>
}

interface IItemProps {
  onClick: Function,
  reload: Function,
  item: EventWithCategory,
  active: optional<EventWithCategory>,
  setRef: any,
  title: String
}

class Item extends Component<IItemProps> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  private active(): void {
    this.props.onClick()
  }

  private join(): void {
    const apiPromise: optional<Promise<Response>> = register(this.props.item.id)
    if (apiPromise) {
      apiPromise.then((response: Response) => {
        if (response.ok) {
          this.props.reload()
        }
      }).catch((e: any) => console.error(e))
    }
  }

  private leave(): void {
    const apiPromise: optional<Promise<Response>> = deregister(this.props.item.id)
    if (apiPromise) {
      apiPromise.then((response: Response) => {
        if (response.ok) {
          this.props.reload()
        }
      }).catch((e: any) => console.error(e))
    }
  }

  public render() {
    return (
      <div className={(this.props.active && this.props.item.id === this.props.active.id) ? 'item active' : 'item'}
           onClick={() => this.active()}>
        <div ref={this.props.setRef} className="item-info">
          <img src='/location-item.svg' className="inline item-photo" />
          <div className="inline item-title">
            {this.props.title}
          </div>
          <div className="inline item-button">
            {(this.props.item.registered) ?
              <button onClick={this.leave.bind(this)}>Leave</button>
              :
              <button onClick={this.join.bind(this)}>Join</button>}
          </div>
        </div>
        <div className="item-categoryBox">
          {this.props.item.categories.map((e: Category) => (
            <span key={e.id} className="item-category">
              {e.title}
            </span>
          ))}
        </div>
      </div>
    )
  }
}

interface ICategoryItem {
  onClick: Function,
  selected: Array<Object>,
  item: Category
}

class CategoryItem extends Component<ICategoryItem> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  private active(): void {
    this.props.onClick()
  }

  public render() {
    return (
      <div className={this.props.selected.includes(this.props.item) ? 'categoryItem active' : 'categoryItem'}>
        <a onClick={() => this.active()}>{this.props.item.title}</a>
      </div>
    )
  }
}

interface IHomeProps {
  isRedirectHome: boolean
}

interface IHomeState {
  events: Array<EventWrapper>,
  recommended: Array<EventWrapper>,
  categories: Array<Category>,
  activeEvent: optional<EventWithCategory>,
  selectedCategories: Array<Category>,
  spots: Array<Spot>,
  selectedSpots: Array<Spot>,
  centerOnUser: boolean,
  searchTitle: string,
  selectedRange: number,
  searchActive: boolean,
  includeRange: boolean,
  timer: optional<any>,
  refreshOn: boolean,
  recommendedTab: boolean,
  eventListTabIndex: number
}

class Home extends Component<IHomeProps & GeolocatedProps, IHomeState> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      events: [],
      recommended: [],
      categories: [],
      activeEvent: null,
      selectedCategories: [],
      spots: [],
      selectedSpots: [],
      centerOnUser: true,
      searchTitle: "",
      selectedRange: 1,
      searchActive: true,
      includeRange: false,
      timer: null,
      refreshOn: true,
      recommendedTab: false,
      eventListTabIndex: 0
    }
    setTimeout(() => this.getEvents(), 250);
    setTimeout(() => this.getRecommendedEvents(), 250);
    setTimeout(() => this.fetchAndUpdateCategories(), 250);
    setTimeout(() => this.fetchLocations(), 250);
  }

  public componentDidMount(): void {
    this.initRefreshTimer()
  }

  public componentWillUnmount(): void {
    clearInterval(this.state.timer);
  }

  public componentWillReceiveProps(props: Readonly<IHomeProps & GeolocatedProps>, nextContext: any): void {

  }

  private fetchAndUpdateCategories(): void {
    this.getCategories()
      .then((categories: Array<Category>) => this.setState({...this.state, categories: categories}))
      .catch((error: Error) => console.log(error))
  }

  private async getCategories(): Promise<Array<Category>> {
    const response: optional<Response> = await fetchAllCategories()
    if (response && response.ok) {
      const data: string = await response.text()
      const categories: Array<Category> = JSON.parse(data)
      return categories
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private fetchLocations(): void {
    this.getLocations()
      .then((locations: Array<Spot>) => {
        console.log(JSON.stringify(locations))
        this.setState({...this.state, spots: locations})
      })
      .catch((error: Error) => console.log(error))
  }

  private async getLocations(): Promise<Array<Spot>> {
    const response: optional<Response> = await fetchAllSpots()
    if (response && response.ok) {
      const data: string = await response.text()
      const locations: Page<Spot> = JSON.parse(data)
      return locations.content
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private initRefreshTimer(): void {
    let timer = setInterval(() =>
      (this.state.recommendedTab) ? this.getRecommendedEvents() : this.getEvents(), 10000)
    this.setState({...this.state, timer: timer})
  }

  private updateEvents(response: Response): void {
    if (response.ok) {
      response.text().then((data: string) => {
        let page: Page<EventWithCategory> = JSON.parse(data)
        if (page.content != null) {
          let objects: Array<EventWrapper> = page.content
            .map((e: EventWithCategory) => Object.assign({}, {item: e, referance: null}))
          let validated: Array<EventWrapper> = objects.filter(e => e.item.location != null)
          this.setState({
            ...this.state,
            events: validated
          })
        }
      }).catch((reason: any) => {
        console.error("request error in ok response: " + JSON.stringify(reason))
      })
    } else {
      response.text().then(text => {
        console.error("request return non-ok response: " + JSON.stringify(text))
      }).catch((reason: any) => {
        console.error("request error in non-ok response: " + JSON.stringify(reason))
      })
    }
  }

  private updateRecommendedEvents(response: Response): void {
    if (response.ok) {
      response.text().then((data: string) => {
          let page: Page<EventWithCategory> = JSON.parse(data)
          if (page.content != null) {
            let objects: Array<EventWrapper> = page.content
              .map((e: EventWithCategory) => Object.assign({}, {item: e, referance: null}))
            let validated: Array<EventWrapper> = objects.filter(e => e.item.location != null)
            this.setState({
              ...this.state,
              recommended: validated
            })
          }
        }
      ).catch((reason: any) => {
        console.error("request error in ok response: " + JSON.stringify(reason))
      })
    } else {
      response.text().then(text => {
        console.error("request return non-ok response: " + JSON.stringify(text))
      }).catch((reason: any) => {
        console.error("request error in non-ok response: " + JSON.stringify(reason))
      })
    }
  }

  private getEvents(): void {
    if (hasToken() && this.state.refreshOn) {
      let eventPromise: optional<Promise<Response>> = fetchAllActiveEvents()
      if (eventPromise != null) {
        eventPromise.then((response: Response) => this.updateEvents(response)).catch((reason: any) => {
          console.error("request error 3: " + JSON.stringify(reason))
        })
      }
    }
  }

  private getRecommendedEvents(): void {
    if (hasToken() && this.state.refreshOn && this.props.coords) {
      let eventPromise: optional<Promise<Response>> =
        fetchAllRecommendedEvents(new Location([this.props.coords.latitude, this.props.coords.longitude]))
      if (eventPromise != null) {
        eventPromise.then((response: Response) => this.updateRecommendedEvents(response))
          .catch((reason: any) => console.error("request error 3: " + JSON.stringify(reason)))
      }
    }
  }

  private searchEvents(title: optional<string>, categories: arrayOptional<Category>,
                       range: optional<number>, includeDistance: boolean, location: arrayOptional<Number>): void {
    if (hasToken()) {
      const parsedCategories: arrayOptional<Category> = (categories && categories.length === 0) ? null : categories
      const search: EventSearch = (includeDistance) ?
        eventSearch(title, parsedCategories, range, location, this.state.searchActive)
        : eventSearch(title, parsedCategories, null, null, this.state.searchActive)
      let eventPromise: optional<Promise<Response>> = searchEvents(search)
      if (eventPromise != null) {
        eventPromise.then((response: Response) => {
          this.updateEvents(response)
          this.eventTabSelected(0)
        })
          .catch((reason: any) => console.error("request error: " + JSON.stringify(reason)))
      }
    }
  }

  private itemClick(e: EventWrapper): void {
    this.setState({...this.state, activeEvent: e.item})
    e.referance.scrollIntoView()
  }

  private mapItemClick(mapItem: EventWithCategory): void {
    this.setState({...this.state, activeEvent: mapItem})
    const item = (this.state.recommendedTab)
      ? this.state.recommended.find(e => e.item === mapItem)
      : this.state.events.find(e => e.item === mapItem)
    if (item) {
      item.referance.scrollIntoView()
    }
  }

  private categorySelected(category: Category): void {
    this.setState({...this.state, selectedCategories:
        !this.state.selectedCategories.includes(category)
          ? [...this.state.selectedCategories, category]
          : [...this.state.selectedCategories.filter(e => e !== category)]
    })
  }

  private areEventsSearchable(): boolean {
    return (this.state.searchTitle && this.state.searchTitle.length > 0)
      || (this.state.selectedCategories.length > 0) || this.state.includeRange
  }

  private search(e: any): void {
    if (this.areEventsSearchable()) {
      this.setState({...this.state, refreshOn: false, activeEvent: null})
      this.searchEvents(this.state.searchTitle, this.state.selectedCategories,
        this.state.selectedRange, this.state.includeRange,
        (this.props.coords) ? new Array<Number>(this.props.coords.latitude, this.props.coords.longitude) : null)
    }
  }

  private eventTabSelected(index: number) {
    this.setState({...this.state, recommendedTab: (index === 1), eventListTabIndex: index})
  }

  private handleSearchInputChange(event): void {
    this.setState({...this.state, searchTitle: event.target.value})
  }

  private clear(e: any): void {
    this.setState({...this.state, searchTitle: "", selectedCategories: [], refreshOn: true})
    this.getEvents()
  }

  public render() {
    let {selectedSpots, spots} = this.state
    return (
      <div className="grid-container">
        <div className="item2">
          {hasToken() ?
            <div className="item2-panel">
              <div className="spotBoxWrapper">
                <label>Location:</label>
                <div className="spotBox">
                  <div className="spotSelectSection">
                    <Select options={spots}
                            onChange={(values: Array<Spot>) => this.setState({...this.state, centerOnUser: false, selectedSpots: values})}
                            values={selectedSpots} labelField={"title"} valueField={"id"}  multi={false} key={"id"} />
                  </div>
                  <div className="spotButtonSection">
                    <button className="spotButton" onClick={() => this.setState({...this.state, centerOnUser: true})}>Find Me</button>
                  </div>
                </div>
              </div>
              <div className="categoryLabel">
                <label>Event categories:</label>
              </div>
              <div className="categoryBox">
                {this.state.categories.map((e: Category) => (
                  <CategoryItem key={e.id} item={e} selected={this.state.selectedCategories}
                                onClick={() => this.categorySelected(e)} />
                ))}
              </div>
            <div className="searchBox">
              <div className="searchBoxInputSection">
                <input className="searchInput" type='text' name='searchInput' placeholder='Search Event...' value={this.state.searchTitle}
                       onChange={this.handleSearchInputChange.bind(this)}/>
                <button className="searchButton" name='searchButton' onClick={this.search.bind(this)}>Search</button>
                <button className="clearButton" name='clearButton' onClick={this.clear.bind(this)}>Clear</button>
              </div>
              {(this.props.coords) ?
                <div className="locationBox">
                  <div className="distanceInput">
                    <div className="locationInfo">
                      <label>
                        Latitude: <b>{String(this.props.coords.latitude).substring(0, 7)}</b> Longitude: <b>{String(this.props.coords.longitude).substring(0, 7)}</b>
                      </label>
                    </div>
                    <div className="distanceInput">
                      <span> Distance: </span>
                      <NumericInput min={1} max={10} value={this.state.selectedRange} onChange={(valueAsNumber: number) => {
                        this.setState({...this.state, selectedRange: valueAsNumber})
                      }} />
                      <span className="locationInclude">
                        <Switch checked={this.state.includeRange}
                                onChange={() => {this.setState({...this.state, includeRange: !this.state.includeRange})}}
                                height={20} />
                      </span>
                    </div>
                  </div>
                </div> : null}
              <div className="locationBox">
                <div className="distanceInput">
                  <div className="activeOnlyLabel">
                    <label>
                      Active events only:
                    </label>
                  </div>
                  <div className="activeOnlySwitch">
                   <Switch checked={this.state.searchActive}
                           onChange={() => {this.setState({...this.state, searchActive: !this.state.searchActive})}}
                           height={20} />
                  </div>
                </div>
              </div>
            </div>
          </div> : null}
          {hasToken() ?
          <div className="item2-list">
            <Tabs selectedIndex={this.state.eventListTabIndex} onSelect={(index: number) => this.eventTabSelected(index)}>
              <TabList>
                <Tab>All</Tab>
                <Tab>Recommended</Tab>
              </TabList>
                <TabPanel>
                  {(this.state.events.length > 0) ?
                    this.state.events.map(e => (
                      <Item title={e.item.title}
                            item={e.item}
                            active={this.state.activeEvent}
                            onClick={() => this.itemClick(e)}
                            reload={() => this.getEvents()}
                            setRef={el => e.referance = el}
                            key={e.item.id}
                      />
                  )) : <p>No active events found</p>}
                </TabPanel>
                <TabPanel>
                  {(this.state.recommended.length > 0) ?
                    this.state.recommended.map(e => (
                      <Item title={e.item.title}
                            item={e.item}
                            active={this.state.activeEvent}
                            onClick={() => this.itemClick(e)}
                            reload={() => this.getEvents()}
                            setRef={el => e.referance = el}
                            key={e.item.id}
                      />
                    )) : <p>No recommended events in this area</p>}
                </TabPanel>
            </Tabs>
          </div> : <p className="login-hint">Please login to see events</p>}
        </div>
        <div className="item3">
          <Map center={(this.state.centerOnUser && this.props.coords)
            ? [this.props.coords.latitude, this.props.coords.longitude]
            : (this.state.selectedSpots.length > 0)
              ? [this.state.selectedSpots[0].location[0], this.state.selectedSpots[0].location[1]]
              : [52.23, 21.00]}
               zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {(this.state.recommendedTab) ?
              this.state.recommended.map(eventWrapper => (
                <Marker
                  key={eventWrapper.item.id}
                  position={[
                    eventWrapper.item.location[0],
                    eventWrapper.item.location[1]
                  ]}
                  onClick={() => {
                    this.mapItemClick(eventWrapper.item)
                  }}
                  icon={icon}
                />
              ))
              :
              this.state.events.map(eventWrapper => (
                <Marker
                  key={eventWrapper.item.id}
                  position={[
                    eventWrapper.item.location[0],
                    eventWrapper.item.location[1]
                  ]}
                  onClick={() => {
                    this.mapItemClick(eventWrapper.item)
                  }}
                  icon={icon}
                />
            ))}
            {this.state.activeEvent && (
              <Popup
                position={[
                  this.state.activeEvent.location[0],
                  this.state.activeEvent.location[1]
                ]}
                onClose={() => {
                  this.setState({...this.state, activeEvent: null})
                }}
              >
                <div>
                  <h2>{this.state.activeEvent.title}</h2>
                  <p>{this.state.activeEvent.description}</p>
                </div>
              </Popup>
            )}
            {this.props.coords && this.props.coords.latitude && this.props.coords.longitude ?
              <Marker
                position={[
                  this.props.coords.latitude,
                  this.props.coords.longitude
                ]}
                icon={userIcon}
              />
              : null}
          </Map>
        </div>
        <div className="item4">Footer</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(geolocated()(Home))
