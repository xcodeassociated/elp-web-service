import React, {Component} from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet"
import { Icon } from "leaflet"
import "../style/App.css"
import "../style/Home.css"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'
import { GeolocatedProps, geolocated } from "react-geolocated"
import { fetchAllEvents, searchEvents } from "../services/EventService"
import { Page } from "../model/Page"
import { EventWithCategory } from "../model/EventWithCategory";
import {EventSearch, eventSearchWithTitle} from "../model/EventSearch";
import {fetchAllCategories} from "../services/CategoryService";
import {Category} from "../model/Category";

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
  referance: any | null
}

interface IItemProps {
  onClick: Function,
  item: EventWithCategory,
  active: EventWithCategory | null,
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

  public render() {
    return (
      <div className={(this.props.active && this.props.item.id === this.props.active.id) ? 'item active' : 'item'}
           onClick={() => this.active()}>
        <p ref={this.props.setRef}>
                    <span className="inline">
                        <img src='/location-item.svg' className="photo" />
                    </span>
          <span className="inline">{this.props.title}</span>
        </p>
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
  items: Array<EventWrapper>,
  categories: Array<Category>,
  activePark: EventWithCategory | null,
  selectedCategories: Array<Category>,
  searchTitle: string,
  timer: any | null,
  refreshOn: boolean
}

class Home extends Component<IHomeProps & GeolocatedProps, IHomeState> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      items: [],
      categories: [],
      activePark: null,
      selectedCategories: [],
      searchTitle: "",
      timer: null,
      refreshOn: true
    }
    setTimeout(() => this.getEvents(), 500);
    this.getCategories()
      .then((categories: Array<Category>) => this.setState({...this.state, categories: categories}))
      .catch((error: Error) => console.log(error))
  }

  public componentDidMount(): void {
    this.initRefreshTimer()
  }

  public componentWillUnmount(): void {
    clearInterval(this.state.timer);
  }

  private async getCategories(): Promise<Array<Category>> {
    const response: Response | null = await fetchAllCategories()
    if (response && response.ok) {
      const data: string = await response.text()
      const categories: Page<Category>= JSON.parse(data)
      return categories.content
    } else {
      throw new Error("Could not fetch categories")
    }
  }

  private initRefreshTimer(): void {
    let timer = setInterval(() => this.getEvents(), 10000)
    this.setState({...this.state, timer: timer})
  }

  private static hasToken(): boolean {
    return localStorage.getItem('token') != null
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
            items: validated
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
    if (Home.hasToken() && this.state.refreshOn) {
      let eventPromise: Promise<Response> | null = fetchAllEvents()
      if (eventPromise != null) {
        eventPromise.then((response: Response) => this.updateEvents(response)).catch((reason: any) => {
          console.error("request error 3: " + JSON.stringify(reason))
        })
      }
    }
  }

  private searchEvents(title: string): void {
    if (Home.hasToken()) {
      const search: EventSearch = eventSearchWithTitle(title)
      let eventPromise: Promise<Response> | null = searchEvents(search)
      if (eventPromise != null) {
        eventPromise.then((response: Response) => this.updateEvents(response)).catch((reason: any) => {
          console.error("request error: " + JSON.stringify(reason))
        })
      }
    }
  }

  private itemClick(e: EventWrapper): void {
    this.setState({...this.state, activePark: e.item})
    e.referance.scrollIntoView()
  }

  private mapItemClick(mapItem: EventWithCategory): void {
    this.setState({...this.state, activePark: mapItem})
    const item = this.state.items.find(e => e.item === mapItem)
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

  private search(e: any): void {
    if (this.state.searchTitle && this.state.searchTitle.length > 0) {
      this.setState({...this.state, refreshOn: false, activePark: null})
      this.searchEvents(this.state.searchTitle)
    }
  }

  private handleSearchInputChange(event): void {
    this.setState({...this.state, searchTitle: event.target.value})
  }

  private clear(e: any): void {
    this.setState({...this.state, searchTitle: "", refreshOn: true})
    this.getEvents()
  }

  public render() {
    return (
      <div className="grid-container">
        <div className="item2">
          {Home.hasToken() ?
            <div className="item2-panel">
            <div className="categoryBox">
              {this.state.categories.map((e: Category) => (
                <CategoryItem key={e.id} item={e} selected={this.state.selectedCategories}
                              onClick={() => this.categorySelected(e)} />
              ))}
            </div>
            <div className="searchBox">
              <input className="searchInput" type='text' name='searchInput' placeholder='Search Event...' value={this.state.searchTitle}
                     onChange={this.handleSearchInputChange.bind(this)}/>
              <button className="searchButton" name='searchButton' onClick={this.search.bind(this)}>Search</button>
              <button className="clearButton" name='clearButton' onClick={this.clear.bind(this)}>Clear</button>
            </div>
          </div> : null}
          {Home.hasToken() ?
          <div className="item2-list">
            <Tabs>
              <TabList>
                <Tab>Recommended</Tab>
                <Tab>All Events</Tab>
              </TabList>
                <TabPanel>
                  {this.state.items.map(e => (
                    <Item title={e.item.title}
                          item={e.item}
                          active={this.state.activePark}
                          onClick={() => this.itemClick(e)}
                          setRef={el => e.referance = el}
                          key={e.item.id}
                    />
                  ))}
                </TabPanel>
              <TabPanel>
              </TabPanel>
            </Tabs>
          </div> : <p className="login-hint">Please login to see events</p>}
        </div>
        <div className="item3">
          <Map center={[52.23, 21.00]} zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {this.state.items.map(eventWrapper => (
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
            {this.state.activePark && (
              <Popup
                position={[
                  this.state.activePark.location[0],
                  this.state.activePark.location[1]
                ]}
                onClose={() => {
                  this.setState({...this.state, activePark: null})
                }}
              >
                <div>
                  <h2>{this.state.activePark.title}</h2>
                  <p>{this.state.activePark.description}</p>
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
