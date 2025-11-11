import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import Toast from './components/ui/Toast';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLoginSuccess = (user?: { name: string; email: string }) => {
    const welcomeMessage = user 
      ? `Login Successful! Welcome, ${user.name}.`
      : 'Login Successful! Welcome back.';
    setToastMessage(welcomeMessage);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <Dashboard />
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </>
  );
};

export default App;