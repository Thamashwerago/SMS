import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
// import AuthRoutes from './routes/AuthRoutes';
// import StudentRoutes from './routes/StudentRoutes';
// import TeacherRoutes from './routes/TeacherRoutes';

const App: React.FC = () => {
  return (
    <Router>
      {/* <AuthRoutes /> */}
      <AdminRoutes />
      {/* <StudentRoutes /> */}
      {/* <TeacherRoutes /> */}

    </Router>
  );
};

export default App;