import React, { createContext, useReducer } from 'react'
import { reducer } from './Reducer';

export const GlobalContext = createContext("Initial Value");

let data = {
    user: {},
    isLogin: null,
    basedUrl :"http://localhost:5002/api/v1",
    userData: "",
    cart: [],
    isReloadCart: false,
    orderDetails: {}
    // isAdmin:false

}

export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, data)
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}