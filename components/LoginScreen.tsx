import React, { useState } from 'react';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Modal from './ui/Modal';

interface LoginScreenProps {
  onLoginSuccess: (user?: { name: string; email: string }) => void;
}

const MOCK_USERS = [
    { name: 'Alex Johnson', email: 'alex.j@example.com', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { name: 'Maria Garcia', email: 'maria.g@example.com', avatar: 'https://i.pravatar.cc/150?u=maria' },
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setTimeout(() => {
        onLoginSuccess();
        setIsLoading(false);
      }, 1500);
    }
  };
  
  const handleGoogleLoginClick = () => {
    setIsModalOpen(true);
  };
  
  const handleSelectGoogleAccount = (user: { name: string; email: string }) => {
    setIsModalOpen(false);
    setIsGoogleLoading(true);
    setTimeout(() => {
        onLoginSuccess(user);
        setIsGoogleLoading(false);
    }, 1500);
  }

  return (
    <>
    <div className="min-h-screen bg-light dark:bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center text-8xl">🐼</div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          to unlock your business potential
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200 dark:border-dark-700">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading || isGoogleLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading || isGoogleLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-brand-orange hover:text-brand-orange-hover">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-orange hover:bg-brand-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:opacity-50"
              >
                {isLoading ? <Spinner /> : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-dark-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="secondary"
                onClick={handleGoogleLoginClick}
                disabled={isLoading || isGoogleLoading}
                className="w-full"
              >
                {isGoogleLoading ? <Spinner className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" /> : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M44.5,20H24v8.5h11.8C34.7,33.9,30.1,37,24,37c-7.2,0-13-5.8-13-13s5.8-13,13-13c3.1,0,5.9,1.1,8.1,2.9l6.4-6.4C34.6,4.1,29.6,2,24,2C11.8,2,2,11.8,2,24s9.8,22,22,22c11,0,21-8,21-22C46,22.5,45.5,21.2,44.5,20z"/>
                  </svg>
                )}
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-brand-orange hover:text-brand-orange-hover">
                Sign up
            </a>
        </p>
      </div>
    </div>
    
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
            <svg className="mx-auto h-12 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0003 4.75C13.7953 4.75 15.3353 5.385 16.5353 6.565L18.4253 4.695C16.5953 3.015 14.4203 2 12.0003 2C7.51029 2 3.73029 4.955 2.19529 8.955L5.03029 10.935C5.79529 7.42 8.60529 4.75 12.0003 4.75Z" fill="#EA4335"/><path d="M12.0003 22.0002C14.3603 22.0002 16.4353 21.0302 18.1003 19.4602L16.2203 17.5802C15.0603 18.5702 13.6203 19.2502 12.0003 19.2502C8.93529 19.2502 6.27029 17.0252 5.40529 14.0752L2.55029 16.0952C4.15029 20.0102 7.78029 22.0002 12.0003 22.0002Z" fill="#34A853"/><path d="M4.75 12C4.75 10.74 5.065 9.565 5.59 8.515L2.73 6.545C2.245 7.64 2 8.78 2 10C2 13.22 2.245 14.36 2.73 15.455L5.59 13.485C5.065 12.435 4.75 11.26 4.75 10Z" fill="#FBBC05" transform="translate(0 2)"/><path d="M19.2504 12.0002C19.2504 11.3852 19.1654 10.7852 19.0104 10.2102H12.0004V14.0252H16.0354C15.8354 15.2202 15.1504 16.2302 14.1204 16.9002L16.9404 18.8802C18.4604 17.4452 19.2504 15.3952 19.2504 12.0002Z" fill="#4285F4"/></svg>
            <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900 dark:text-white">Choose an account</h3>
            <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">to continue to Adaptive AI</p>
            </div>
        </div>
        <div className="mt-5 space-y-3">
            {MOCK_USERS.map(user => (
                <button 
                    key={user.email}
                    onClick={() => handleSelectGoogleAccount(user)}
                    className="w-full text-left flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                    <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                </button>
            ))}
             <button className="w-full text-left flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-dark-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Use another account</p>
                </div>
            </button>
        </div>
    </Modal>
    </>
  );
};

export default LoginScreen;