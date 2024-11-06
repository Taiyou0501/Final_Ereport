import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import UserLogout from '../../UserLogout';

const UserIndex = () => {
    const navigate = useNavigate();
  return (
    <div className="index-responder-body">
        <UserLogout/>

        <div className="index-tabs-reporter">
            <button className="report-btn" onClick={() => navigate('/user/photo')}></button>
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