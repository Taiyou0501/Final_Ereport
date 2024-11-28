import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import UserLogout from '../../UserLogout';

const UserIndex = () => {
  const navigate = useNavigate();

  const handleFireEmergencyClick = async () => {
    try {
      const response = await api.post('/api/reports', {
        description: 'FIRE',
        type: 'Fire Emergency'
      });
      console.log('Fire emergency report submitted:', response.data);
      navigate('/user/submission-success');
    } catch (error) {
      console.error('Error submitting fire emergency report:', error);
    }
  };

  return (
    <div className="index-responder-body">
      <UserLogout />

      <div className="index-tabs-responder">
        <p className="et-text">SELECT EMERGENCY TYPE:</p>
        <div className="emergency-type-container">
          <div className="et-individual">
            <div className="et-image" onClick={() => navigate('/user/individual')}></div>
            <p className="et-label">Injured Individuals</p>
          </div>

          <div className="et-vehicular">
            <div className="et-image" onClick={() => navigate('/user/vehicular')}></div>
            <p className="et-label">Vehicular Emergency</p>
          </div>

          <div className="et-fire">
            <div className="et-image" onClick={handleFireEmergencyClick}></div>
            <p className="et-label">Fire Emergency</p>
          </div>

          <div className="et-others">
            <div className="et-image" onClick={() => navigate('/user/others')}></div>
            <p className="et-label">Others</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIndex;