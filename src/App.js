import React from 'react';
import SignUp from './components/Auth/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Profile from './components/Auth/Profile';
import Login from './components/Auth/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import ForgotPassword from './components/Auth/ForgotPassword';
import UpdateProfile from './components/Auth/UpdateProfile';
import Dashboard from './components/google-drive/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* Drive */}
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/folder/:folderId" component={Dashboard} />

          {/* Profile */}
          <PrivateRoute path="/user" component={Profile} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />

          {/* Auth */}
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
