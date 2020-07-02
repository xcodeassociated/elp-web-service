import React, {Component, ReactChild} from "react";
import {NavLink, Route, Router, Switch} from 'react-router-dom'
import Home from "../components/Home";
import {Nav} from "react-bootstrap";
import history from './History';
import {connect} from 'react-redux';
import Events from "../components/Events";
import {KeycloakEvent, KeycloakProvider, KeycloakTokens} from "@react-keycloak/web";
import keycloak from "../components/Keycloak";
import {KeycloakError} from "keycloak-js";
import {loginAction, logoutAction, redirectHomeAction} from '../store/actions/Actions'
import NotFound from "../components/error/NotFound";
import "../style/App.css";
import "../style/AppRouter.css";
import Settings from "../components/Settings";
import UserHistory from "../components/UserHistory";
import {hasToken} from "../services/TokenService";

type NamedProps = {
  data?: any
}

type PropsAppRouter = {
  children: ReactChild | NamedProps,
  dispatch: Function
}

interface IStateAppRouter {
}

class AppContext extends Component<PropsAppRouter, IStateAppRouter> {

  constructor(props: Readonly<PropsAppRouter>) {
    super(props)
    this.state = {}

    this.props.dispatch(redirectHomeAction(true))
  }

  private onKeycloakEvent = (event: KeycloakEvent, error?: KeycloakError): void => {
    console.info("Keycloak event: " + JSON.stringify(event))
    if (error) {
      console.error("Keycloak error: " + JSON.stringify(error))
    }
  }

  private onKeycloakTokens = (tokens: KeycloakTokens): void => {
    console.info("Keycloak token: " + JSON.stringify(tokens))
    if (tokens.token) {
      console.info("Updating local storage token")
      this.props.dispatch(loginAction(tokens.token))
      this.props.dispatch(redirectHomeAction(false))
    }
  }

  public render() {
    return (
      <KeycloakProvider keycloak={keycloak}
                        onEvent={this.onKeycloakEvent}
                        onTokens={this.onKeycloakTokens}
                        autoRefreshToken={true}
      >
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
      </KeycloakProvider>
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
