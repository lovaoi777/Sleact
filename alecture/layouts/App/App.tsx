import React from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import Login from '@pages/Login';
import SignUp from '@pages/SignUp';
import WorkSpace from '@layouts/Workspace/Workspace';
// const Login = loadable(() => import('@pages/Login'));
// const SignUp = loadable(() => import('@pages/SignUp'));
// const WorkSpace = loadable(() => import('@layouts/Workspace/Workspace'));
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/:workspace/*" element={<WorkSpace />} />
      </Routes>
    </div>
  );
};

export default App;
