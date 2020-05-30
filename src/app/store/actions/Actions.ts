export const actions = {
  SET_LOGIN_SUCCESS: 'SET_LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  REDIRECT_HOME: 'REDIRECT_HOME'
};

export function loginAction(token: string): object {
  return dispatch => {
    dispatch(setLoginSuccess(false))
    localStorage.setItem('token', token);
    dispatch(setLoginSuccess(true))
  }
}

export function logoutAction(): object {
  return dispatch => {
    localStorage.removeItem('token')
    dispatch(setLogout())
  }
}

export function redirectHomeAction(value: boolean): object {
  return dispatch => {
    localStorage.setItem('redirectHome', String(value))
    dispatch(setRedirectHome(value))
  }
}

function setLoginSuccess(isLoginSuccess: boolean): any {
  return {
    type: actions.SET_LOGIN_SUCCESS,
    isLoginSuccess
  };
}

function setLogout(): any {
  return {
    type: actions.LOGOUT
  }
}

function setRedirectHome(value: boolean) {
  return {
    type: actions.REDIRECT_HOME,
    value
  }
}
