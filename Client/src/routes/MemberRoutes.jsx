import { Routes, Route, Navigate } from 'react-router-dom';

import MemberLayout from '../Pages/Layouts/MemberLayout';
import Home from '../Pages/member/Home';
import MyArticles from '../Pages/member/MyArticles';
import ArticleCreationForm from '../Components/Article/ArticleCreationForm';
import ArticleDetailsPage from '../Components/Article/ArticleDetailsPage';
import Profile from '../Pages/public/Profile';
import Notification from '../Pages/member/Notifications';


const MemberRoutes = () => {
  return (
    
        <Routes>
          <Route element={<MemberLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home/>} />  {/* /member/home */}
          <Route path="my-articles" element={<MyArticles />} /> {/* /member/my-articles */}
          <Route path="/articles/:id" element={<ArticleDetailsPage/>} />
          <Route path="articles/add" element={<ArticleCreationForm/>} />
          <Route path="articles/edit/:id" element={<ArticleCreationForm />} />
          <Route path="notification" element={<Notification />} />  {/* /member/notification */}
          <Route path="profile" element={<Profile />} />  {/* /member/profile */}
          
          <Route path="*" element={<div>Page membre non trouvée</div>} />
          </Route>
      </Routes>

  )
}

export default MemberRoutes
