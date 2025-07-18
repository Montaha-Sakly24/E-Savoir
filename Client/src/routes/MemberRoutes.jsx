import {Routes, Route} from 'react-router-dom';
import DashboardMember from '../Pages/member/dashboardMember';
import Profile from '../Pages/member/Profile';

const MemberRoutes = () => {
  return (
      <>
      <Routes>
          <Route index element={<DashboardMember />} />
          <Route path="profile" element={<Profile />} />

          
          <Route path="*" element={<div>Page membre non trouvée</div>} />
      </Routes>
      </>
  )
}

export default MemberRoutes
