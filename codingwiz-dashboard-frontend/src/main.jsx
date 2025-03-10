import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './App'
import { Provider } from 'react-redux';
import store from './redux/store';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={routes}/>
    </Provider>
)
