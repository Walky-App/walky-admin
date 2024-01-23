import * as React from 'react'

const UserContext = React.createContext('any' as any)

const UserContextProvider = ({ children }: any) => {
  const [user, setUser] = React.useState({})

  console.log('user in context->', user)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export { UserContext, UserContextProvider }
