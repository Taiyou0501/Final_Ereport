import './App.css'
import Login from './Components/LoginRegister/Login'
import Register from './Components/Register/Register'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AdminHome from './Components/Admin/AdminHome'
import AdminReports from './Components/Admin/AdminReports'
import AdminAccounts from './Components/Admin/AdminAccounts'
import AdminProfile from './Components/Admin/AdminProfile'
import AdminCheckAccount from './Components/Admin/AdminCheckAccount'
import AdminCreateAccount from './Components/Admin/AdminCreateAccount'
import AddUnitAccount from './Components/Admin/AddUnitAccount'
import AddPoliceAccount from './Components/Unit/AddPoliceAccount'
import AddBarangayAccount from './Components/Admin/AddBarangayAccount'
import UnitHome from './Components/Unit/UnitHome'
import UnitDashboard from './Components/Unit/UnitDashboard'
import UnitAccount from './Components/Unit/UnitAccounts'
import UnitProfile from './Components/Unit/UnitProfile'
import AddResponderAccount from './Components/Unit/AddResponderAccount'
import CheckAccounts from './Components/Unit/CheckAccounts'
import UserIndex from './Components/User/UserIndex'
import UserPhoto from './Components/User/UserPhoto'
import UserEmergencyType from './Components/User/UserEmergencyType'
import Individual from './Components/User/Individual'
import Victim from './Components/User/victim'
import Vehicular from './Components/User/Vehicular'
import Others from './Components/User/Others'
import Success from './Components/User/Success'
import ResponderHome from './Components/Responder/ResponderHome'
import ResponderNotification from './Components/Responder/ResponderNotification'
import ResponderFinal from './Components/Responder/ResponderFinal'
import PoliceFinal from './Components/Police/PoliceFinal'
import PoliceHome from './Components/Police/PoliceHome'
import PoliceNotification from './Components/Police/PoliceNotification'
import BarangayFinal from './Components/Barangay/BarangayFinal'
import BarangayHome from './Components/Barangay/BarangayHome'
import BarangayNotification from './Components/Barangay/BarangayNotification'

import{
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Login/></div>
  },
  {
    path: '/login',
    element: <div><Login/></div>
  },
  {
    path: '/register',
    element: <div><Register/></div>
  },
  {
    path: '/a-dashboard',
    element: <div><AdminDashboard/></div>
  },
  {
    path: '/a-home',
    element: <div><AdminHome/></div>
  },
  {
    path: '/a-reports',
    element: <div><AdminReports/></div>
  },
  {
    path: '/a-accounts',
    element: <div><AdminAccounts/></div>
  },
  {
    path: '/a-check-accounts',
    element: <div><AdminCheckAccount/></div>
  },
  {
    path: '/a-create-accounts',
    element: <div><AdminCreateAccount/></div>
  },
  {
    path: '/a-add-unit',
    element: <div><AddUnitAccount/></div>
  },
  {
    path: '/a-add-barangay',
    element: <div><AddBarangayAccount/></div>
  },
  {
    path: '/a-profile',
    element: <div><AdminProfile/></div>
  },
  {
    path: '/u-home',
    element: <div><UnitHome/></div>
  },
  {
    path: '/u-dashboard',
    element: <div><UnitDashboard/></div>
  },
  {
    path: '/u-accounts',
    element: <div><UnitAccount/></div>
  },
  {
    path: '/u-profile',
    element: <div><UnitProfile/></div>
  },
  {
    path: '/u-add-responder',
    element: <div><AddResponderAccount/></div>
  },
  {
    path: '/u-add-police',
    element: <div><AddPoliceAccount/></div>
  },
  {
    path: '/u-check-accounts',
    element: <div><CheckAccounts/></div>
  },
  {
    path: '/user',
    element: <div><UserIndex/></div>
  },
  {
    path: '/user-photo',
    element: <div><UserPhoto/></div>
  },
  {
    path: '/user-emergency-type',
    element: <div><UserEmergencyType/></div>
  },
  {
    path: '/individual',
    element: <div><Individual/></div>
  },
  {
    path: '/victim',
    element: <div><Victim/></div>
  },
  {
    path: '/vehicular',
    element: <div><Vehicular/></div>
  },
  {
    path: '/others',
    element: <div><Others/></div>
  },
  {
    path: '/submission-success',
    element: <div><Success/></div>
  },
  {
    path: '/responder-home',
    element: <div><ResponderHome/></div>
  },
  {
    path: '/responder-report-received',
    element: <div><ResponderNotification/></div>
  },
  {
    path: '/responder-final',
    element: <div><ResponderFinal/></div>
  },
  {
    path: '/police-final',
    element: <div><PoliceFinal/></div>
  },
  {
    path: '/police-home',
    element: <div><PoliceHome/></div>
  },
  {
    path: '/police-notification',
    element: <div><PoliceNotification/></div>
  },
  {
    path: '/barangay-final',
    element: <div><BarangayFinal/></div>
  },
  {
    path: '/barangay-home',
    element: <div><BarangayHome/></div>
  },
  {
    path: '/barangay-notification',
    element: <div><BarangayNotification/></div>
  }


  
])

function App() {

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
   )
}

export default App
