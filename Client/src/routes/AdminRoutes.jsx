import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../Pages/Layouts/AdminLayout';
import Dashboard from '../Pages/admin/Dashboard';
import Members from '../Pages/admin/MemberList';
import Categories from '../Pages/admin/CategoryList';
import Articles from '../Pages/admin/ArticleList';
import ArticleDetailsPage from '../Components/Article/ArticleDetailsPage';
import Notifications from '../Pages/admin/NotificationList';
import Profile from '../Pages/public/Profile';


const AdminRoutes = () => {
  return (
    
        <Routes>
          <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard/>} />  {/* /admin/dashboard */}
          <Route path="members-list" element={<Members/>} />  {/* /admin/members */}
          <Route path="categories-list" element={<Categories/>} />  {/* /admin/categories */}
          <Route path="articles-list" element={<Articles />} /> {/* /admin/articles */}
          <Route path="/articles/:id" element={<ArticleDetailsPage/>} />
          <Route path="notifications-list" element={<Notifications />} />  {/* /admin/notification */}
          <Route path="profile" element={<Profile />} />  {/* /admin/profile */}
          
          <Route path="*" element={<div>Page admin non trouvée</div>} />
          </Route>
      </Routes>
    
  )
}

export default AdminRoutes
