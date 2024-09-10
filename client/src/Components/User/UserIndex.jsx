import '../CSS/user.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const UserIndex = () => {
    const navigate = useNavigate();
  return (
    <div className="index-responder-body">
        <header className="index-reporter-header">
            <div className="index-main-text">E-REPORT</div>
        </header>
        <header className="index-header-tab">
            <button className="index-menu-btn">
                <FontAwesomeIcon icon={faBars} />
                <span className="index-menu-text">HELLO, REPORTER</span>
            </button>
            <div className="index-reporter-actions">
                <button className="index-profile-btn">
                    <FontAwesomeIcon icon={faUser} />
                </button>
                <button className="index-logout-btn" onClick={() => navigate('/login')}>
                    <FontAwesomeIcon icon={faPowerOff} />
                </button>
            </div>
        </header>

        <div className="index-tabs-reporter">
            <button className="report-btn" onClick={() => window.location.href = "user-photo"}></button>
            <div className="text-container">
                <p className="report-text">REPORT</p>
                <p className="sub-text">IF THERE'S AN EMERGENCY, CLICK THE RED BUTTON</p>
            </div>
        </div>

        <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>

    </div>
);

}
export default UserIndex;