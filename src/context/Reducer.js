export const reducer = (state, action) => {
    switch (action.type) {
      case "USER_LOGIN": {
        return { ...state, isLogin: true , user: action.payload , isAdmin : false}
      }
      case "ADMIN_LOGIN" : {
         return {...state, isLogin: true , user: action.payload , isAdmin : true}
      }
      case "USER_LOGOUT": {
        return { ...state, isLogin: false , isAdmin: false } // set this to null on purpose, do not change
      }
      case "CATEGORY_LIST": {
        return { ...state, categoryList:action.payload } // set this to null on purpose, do not change
      }
      case "RESET_PASSWORD": {
        return{...state , userData : action.payload}
      }
      case "UPDATE_CART": {
        return{...state , cart : action.payload}
      }
      case "TOGGLE_CART": {
        return{...state , isReloadCart : !state.isReloadCart}
      }
      case "ORDER_DETAILS": {
        return{...state , orderDetails : action.payload}
      }
      default: {
        return state
      }
    }
  }