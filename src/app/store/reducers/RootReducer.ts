import {actions} from '../actions/Actions'

export default function RootReducer(state = {}, action) {
  switch (action.type) {
    case actions.SET_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoginSuccess: action.isLoginSuccess
      });

    case actions.LOGOUT:
      return Object.assign({}, state, {
        isLoginSuccess: false
      });

    case actions.REDIRECT_HOME:
      return Object.assign({}, state, {
        isRedirectHome: action.value
      });

    default:
      return state
  }
}
