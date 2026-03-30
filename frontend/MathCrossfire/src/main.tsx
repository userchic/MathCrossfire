
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from "react-router"
import { Provider } from 'react-redux'
import { store } from './Store.tsx'

createRoot(document.getElementById('root')!).render(

  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>

)
