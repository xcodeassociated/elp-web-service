import React, {Component, ReactChild} from "react";
import {NavLink, Route, Router, Switch} from 'react-router-dom'
import Home from "../components/Home/Home";
import {Nav} from "react-bootstrap";
import history from './History';
import {connect} from 'react-redux';
import Events from "../components/Events/Events";
import keycloak from "../components/Keycloak/Keycloak";
import {loginAction, logoutAction, redirectHomeAction} from '../store/actions/Actions'
import NotFound from "../components/error/NotFound";
import "../style/App.css";
import "../style/AppRouter.css";
import Settings from "../components/Settings/Settings";
import UserHistory from "../components/UserHistory/UserHistory";
import {hasToken} from "../services/TokenService";
import {optional} from "../model/Types";

type NamedProps = {
  data?: any
}

type PropsAppRouter = {
  children: ReactChild | NamedProps,
  token: optional<string>,
  dispatch: Function
}

interface IStateAppRouter {}

class AppContext extends Component<PropsAppRouter, IStateAppRouter> {

  constructor(props: Readonly<PropsAppRouter>) {
    super(props)
    this.props.dispatch(redirectHomeAction(true))
  }

  componentDidUpdate(prevProps: Readonly<PropsAppRouter>, prevState: Readonly<IStateAppRouter>, snapshot?: any) {
    if (this.props.token !== prevProps.token) {
      if (this.props.token) {
        this.updateKeycloakToken(this.props.token)
      } else {
        console.warn("Keycloak token prop null passed")
      }
    }
  }

  private updateKeycloakToken(token: string) {
    console.info("Updating local storage token")
    this.props.dispatch(loginAction(token))
    this.props.dispatch(redirectHomeAction(false))
  }

  public render() {
    return (
        <Router history={history}>
          <div className="grid-container">
            <div className="item1">
              <div id="app-router">
                <div className="menu-bar">
                  <Nav defaultActiveKey="/home" as="ul" className="navbar-component">
                    <Nav.Item as="li">
                      <NavLink className="nav-link" activeClassName="active" to="/" exact>Home</NavLink>
                    </Nav.Item>
                    {
                      !hasToken() ?
                        null :
                        <Nav.Item as="li">
                          <NavLink className="nav-link" activeClassName="active" to="/events">Events</NavLink>
                        </Nav.Item>
                    }
                    {
                      !hasToken() ?
                        null :
                        <Nav.Item as="li">
                          <NavLink className="nav-link" activeClassName="active" to="/history">History</NavLink>
                        </Nav.Item>
                    }
                    {
                      !hasToken() ?
                        null :
                        <Nav.Item as="li">
                          <NavLink className="nav-link" activeClassName="active" to="/settings">Settings</NavLink>
                        </Nav.Item>
                    }
                    {
                      hasToken() ?
                        <button type="button" onClick={() => {
                          keycloak.logout()
                          this.props.dispatch(redirectHomeAction(true))
                          this.props.dispatch(logoutAction())
                        }}>
                          Logout
                        </button>
                        :
                        <button type="button" onClick={() => {
                          keycloak.login()
                        }}>
                          Login
                        </button>
                    }
                  </Nav>
                </div>
                <div id="body">
                  <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/home/:param?' component={HomeParam}/>
                    <Route exact path='/events' component={Events} />
                    <Route exact path='/history' component={UserHistory}/>
                    <Route exact path='/settings' component={Settings}/>
                    <Route component={NotFound}/>
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </Router>
    )
  }
}

function HomeParam({match}): any {
  return (
    <div>
      <Home param={match.params.param}/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(AppContext)
