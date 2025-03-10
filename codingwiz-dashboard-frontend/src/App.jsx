import Login from './view/Login'
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './view/Navbar';
import SideBar from './view/SideBar';
import Home from './view/Home';
import Payment from './view/Payment';
import Customer from './view/Customer';
import ProtectedRoute from './view/ProtectedRoute';
import PaymentLink from './view/PaymentLink';
import Invoice from './view/Invoice';
import Coupon from './view/Coupon';
import Developer from './view/Developer';
import Subscription from './view/Subscription';
import Setting from './view/Setting';
import AccountDetail from './components/Setting/AccountDetail';
import BusinessDetail from './components/Setting/BusinessDetail';
const App = () => {
  return (
    <>
            <Navbar/>
            <div className='flex'>
                <SideBar/>
                <Outlet/>
            </div>
    </>
  )
}

export const routes = createBrowserRouter([ 
    {
        path:"/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: (
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/payment",
                element: (
                    <ProtectedRoute>
                        <Payment/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/customer",
                element: (
                    <ProtectedRoute>
                        <Customer/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/payment-link",
                element: (
                    <ProtectedRoute>
                        <PaymentLink/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/invoice",
                element: (
                    <ProtectedRoute>
                        <Invoice/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/coupon",
                element: (
                    <ProtectedRoute>
                        <Coupon/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/developer",
                element: (
                    <ProtectedRoute>
                        <Developer/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/subscription",
                element: (
                    <ProtectedRoute>
                        <Subscription/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/setting",
                element: (
                    <ProtectedRoute>
                        <Setting/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/setting/account-detail",
                element: (
                    <ProtectedRoute>
                        <AccountDetail/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/setting/business-detail",
                element: (
                    <ProtectedRoute>
                        <BusinessDetail/>
                    </ProtectedRoute>
                )
            }
            
        ]
    },
    {
        path: "/login",
        element: <Login/>
    }
])

export default App;