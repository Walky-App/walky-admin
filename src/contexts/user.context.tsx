import * as React from 'react'

const UserContext = React.createContext('any' as any)

const UserContextProvider = ({ children }: any) => {
  const [user, setUser] = React.useState({})

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export { UserContext, UserContextProvider }
