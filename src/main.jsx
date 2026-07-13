import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {store} from './store/store.js'

// redux persist used to make the response of server and client data synchronize(same) like time on server is 12m 1s and when client takes it becomes 12m 2s its a hydration issue that this solves 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <BrowserRouter>
      <App />
     </BrowserRouter>
    </Provider>
  </StrictMode>,
)
