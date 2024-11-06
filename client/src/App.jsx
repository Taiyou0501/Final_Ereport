import './App.css';
import Login from './Components/LoginRegister/Login';
import Register from './Components/Register/Register';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminHome from './Components/Admin/AdminHome';
import AdminReports from './Components/Admin/AdminReports';
import AdminAccounts from './Components/Admin/AdminAccounts';
import AdminProfile from './Components/Admin/AdminProfile';
import AdminCheckAccount from './Components/Admin/AdminCheckAccount';
import AdminCreateAccount from './Components/Admin/AdminCreateAccount';
import AddUnitAccount from './Components/Admin/AddUnitAccount';
import AddPoliceAccount from './Components/Unit/AddPoliceAccount';
import AddBarangayAccount from './Components/Admin/AddBarangayAccount';
import UnitHome from './Components/Unit/UnitHome';
import UnitDashboard from './Components/Unit/UnitDashboard';
import UnitAccount from './Components/Unit/UnitAccounts';
import UnitProfile from './Components/Unit/UnitProfile';
import AddResponderAccount from './Components/Unit/AddResponderAccount';
import CheckAccounts from './Components/Unit/CheckAccounts';
import UserIndex from './Components/User/UserIndex';
import UserPhoto from './Components/User/UserPhoto';
import UserEmergencyType from './Components/User/UserEmergencyType';
import Individual from './Components/User/Individual';
import Victim from './Components/User/victim';
import Vehicular from './Components/User/Vehicular';
import Others from './Components/User/Others';
import Success from './Components/User/Success';
import ResponderHome from './Components/Responder/ResponderHome';
import ResponderNotification from './Components/Responder/ResponderNotification';
import ResponderFinal from './Components/Responder/ResponderFinal';
import PoliceFinal from './Components/Police/PoliceFinal';
import PoliceHome from './Components/Police/PoliceHome';
import PoliceNotification from './Components/Police/PoliceNotification';
import BarangayFinal from './Components/Barangay/BarangayFinal';
import BarangayHome from './Components/Barangay/BarangayHome';
import BarangayNotification from './Components/Barangay/BarangayNotification';

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminLayout from './Components/Admin/AdminLayout';
import BarangayLayout from './Components/Barangay/BarangayLayout';
import PoliceLayout from './Components/Police/PoliceLayout';
import ResponderLayout from './Components/Responder/ResponderLayout';
import UnitLayout from './Components/Unit/UnitLayout';
import UserLayout from './Components/User/UserLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminLayout/></ProtectedRoute>,
    children: [
      {
        path: 'a-dashboard',
        element: <AdminDashboard/>
      },
      {
        path: 'home',
        element: <AdminHome/>
      },
      {
        path: 'reports',
        element: <AdminReports/>
      },
      {
        path: 'accounts',
        element: <AdminAccounts/>
      },
      {
        path: 'a-check-accounts',
        element: <AdminCheckAccount/>
      },
      {
        path: 'a-create-accounts',
        element: <AdminCreateAccount/>
      },
      {
        path: 'add-unit',
        element: <AddUnitAccount/>
      },
      {
        path: 'add-barangay',
        element: <AddBarangayAccount/>
      },
      {
        path: 'profile',
        element: <AdminProfile/>
      }
    ]
  },
  {
    path: '/unit',
    element: <ProtectedRoute><UnitLayout/></ProtectedRoute>,
    children: [
      {
        path: 'home',
        element: <UnitHome/>
      },
      {
        path: 'dashboard',
        element: <UnitDashboard/>
      },
      {
        path: 'accounts',
        element: <UnitAccount/>
      },
      {
        path: 'profile',
        element: <UnitProfile/>
      },
      {
        path: 'add-responder',
        element: <AddResponderAccount/>
      },
      {
        path: 'add-police',
        element: <AddPoliceAccount/>
      },
      {
        path: 'check-accounts',
        element: <CheckAccounts/>
      }
    ]
  },
  {
    path: '/user',
    element: <ProtectedRoute><UserLayout/></ProtectedRoute>,
    children: [
      {
        path: 'index',
        element: <UserIndex/>
      },
      {
        path: 'photo',
        element: <UserPhoto/>
      },
      {
        path: 'emergency-type',
        element: <UserEmergencyType/>
      },
      {
        path: 'individual',
        element: <Individual/>
      },
      {
        path: 'victim',
        element: <Victim/>
      },
      {
        path: 'vehicular',
        element: <Vehicular/>
      },
      {
        path: 'others',
        element: <Others/>
      },
      {
        path: 'submission-success',
        element: <Success/>
      }
    ]
  },
  {
    path: '/responder',
    element: <ProtectedRoute><ResponderLayout/></ProtectedRoute>,
    children: [
      {
        path: 'home',
        element: <ResponderHome/>
      },
      {
        path: 'report-received',
        element: <ResponderNotification/>
      },
      {
        path: 'final',
        element: <ResponderFinal/>
      }
    ]
  },
  {
    path: '/police',
    element: <ProtectedRoute><PoliceLayout/></ProtectedRoute>,
    children: [
      {
        path: 'final',
        element: <PoliceFinal/>
      },
      {
        path: 'home',
        element: <PoliceHome/>
      },
      {
        path: 'notification',
        element: <PoliceNotification/>
      }
    ]
  },
  {
    path: '/barangay',
    element: <ProtectedRoute><BarangayLayout/></ProtectedRoute>,
    children: [
      {
        path: 'final',
        element: <BarangayFinal/>
      },
      {
        path: 'home',
        element: <BarangayHome/>
      },
      {
        path: 'notification',
        element: <BarangayNotification/>
      }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;