import { useState } from 'react'

import './App.css'
import { Layout, Menu } from 'antd'
import { Link, Route, Routes } from 'react-router'
import { PrivateRoute } from './Components/PrivateRoute'
import LoginForm from './Components/LoginForm'
import RegistryForm from './Components/RegistryForm'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import { ExecuteLogOut } from './Services/HomeService'
import TasksList from './Components/Tasks/TasksList'
import TaskCreator from './Components/Tasks/TaskCreator'
import GamesList from './Components/Game/GamesList'
import GameCreator from './Components/Game/GameCreator'
import GameInterface from './Components/Game/GameInterface'
import TeamsInterface from './Components/Teams/TeamsInterface'
import TeamsCreator from './Components/Teams/TeamsCreator'
import { signOut, store } from './Store'
import TeamInterface from './Components/Teams/TeamInterface'

function App() {
  const [isAuthenticated, setAuth] = useState<boolean>(!!store.getState().Auth.isAuthenticated)
  const [Login, setLogin] = useState(store.getState().Auth.login)
  function ExecuteLogout(event): void {
    event.preventDefault()
    let res = ExecuteLogOut()
    res.then((response) => {
      if (response.ok) {
        localStorage.setItem("authFlag", "false");
        localStorage.setItem("login", "");
        store.dispatch(signOut())
      }
      setAuth(false)
    })
  }
  store.subscribe(() => {
    let slice = store.getState().Auth
    setAuth(slice.isAuthenticated)
    setLogin(slice.login)
  })
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <Menu theme="dark"
            mode="horizontal"
            items={isAuthenticated == true ?
              [
                { key: "siteName", label: <Link to={"/"}>"Перестрелка" - математическая игра</Link> },
                { key: "games", label: <Link to={"/Games"}>Бои</Link> },
                { key: "tasks", label: <Link to={"/Tasks"}>Задачи</Link> },
                { key: "logout", label: <Link to={""} onClick={ExecuteLogout} >Выход</Link> },
                { key: "nick", label: Login }
              ]
              :
              [
                { key: "siteName", label: <Link to={"/"}>"Перестрелка" - математическая игра</Link> },
                { key: "games", label: <Link to={"/Games"}>Игры</Link> },
                { key: "login", label: <Link to={"/Login"}>Вход</Link> },
                { key: "registry", label: <Link to={"/Registry"}>Регистрация</Link> },
              ]
            }
            style={{ flex: 1, minWidth: 0 }}
          ></Menu>
        </Header>
        <Content style={{ padding: "0 48px" }}>
          <Routes>
            <Route path='/Games' element={<GamesList />} />
            <Route path="/Login" element={<LoginForm />} />
            <Route path="/Registry" element={<RegistryForm />} />
            <Route element={<PrivateRoute />}>
              <Route path='/Tasks' element={<TasksList />} />
              <Route path='/Tasks/Creator' element={<TaskCreator />} />
              <Route path='/Games/Creator' element={<GameCreator />} />
              <Route path="/Game/:gameId/" element={<GameInterface />} />
              <Route path='/Teams/:gameId' element={<TeamsInterface />} />
              <Route path='/Teams/Creator/:gameId' element={<TeamsCreator />} />
              <Route path="/Team/:teamId" element={<TeamInterface />} />
            </Route>
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          MathCrossfire 2026 Created by me
        </Footer>
      </Layout >
    </>
  )
}

export default App
