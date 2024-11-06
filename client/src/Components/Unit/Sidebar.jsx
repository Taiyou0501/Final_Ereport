import logo from'../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import Logout from "../../Logout";
import { useNavigate } from 'react-router-dom';
import '../CSS/Dashboard.css';
const Sidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
      navigate(path, { replace: true });
    };
    return (
      <nav className="sidebar">
        <header className="header">
          <div className="image-text">
            <span className = "image">
              <img src={logo} alt="logo" />
              <span className="title">Electronic</span>
              <span className="title">Response</span>
              <span className="title">Portal</span>
            </span>
          </div>
        </header>
        <div className="menu-bar">
          <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <a onClick={() => handleNavigation('/unit/home')}>
                  <FontAwesomeIcon icon={faHouse} className="icon" />
                  <span className="text nav-text">Home</span>
                </a>
            </li>
            <li className="nav-link">
              <a onClick={() => handleNavigation('/unit/accounts')}>
                  <FontAwesomeIcon icon={faUsers} className="icon" />
                  <span className="text nav-text">Accounts</span>
                </a>
            </li>
            <li className="nav-link">
              <a onClick={() => handleNavigation('/unit/profile')}>
                  <FontAwesomeIcon icon={faCircleUser} className="icon" />
                  <span className="text nav-text">Profile</span>
                </a>
            </li>
            </ul>
          </div>
          <div className="bottom-content">
              <Logout />  
          </div>
        </div>
      </nav>
    )
  };


export default Sidebar;