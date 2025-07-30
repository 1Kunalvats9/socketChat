'use client'
import React, {useEffect} from 'react';
import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import {useRouter} from "next/navigation";

export default function App() {
  const [isLoginView, setIsLoginView] = useState(true);

  // Form input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState({ text: '', type: '' });
  const [signupMessage, setSignupMessage] = useState({ text: '', type: '' });

  const router = useRouter();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      router.push("/home")
    }
  },[])

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginMessage({ text: 'Login successful!', type: 'success' });
        localStorage.setItem("token",data.token)
        localStorage.setItem("email",data.email)
        setTimeout(()=>{
          router.push("/home")
        },1500)
      } else {
        setLoginMessage({ text: data.message || 'Login failed', type: 'error' });
      }
    } catch (error) {
      setLoginMessage({ text: 'An error occurred during login', type: 'error' });
      console.error('Login error:', error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSignupLoading(true);
    setSignupMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: signupName, 
          email: signupEmail, 
          password: signupPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignupMessage({ text: 'Signup successful!', type: 'success' });
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
      } else {
        setSignupMessage({ text: data.message || 'Signup failed', type: 'error' });
      }
    } catch (error) {
      setSignupMessage({ text: 'An error occurred during signup', type: 'error' });
      console.error('Signup error:', error);
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
          {isLoginView ? (
              <div>
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                  Welcome Back!
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
                  Please sign in to your account
                </p>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Email address"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Password"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div>
                    <button
                        type="submit"
                        disabled={isLoginLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoginLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                  {loginMessage.text && (
                    <div className={`mt-4 p-3 rounded-md ${loginMessage.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {loginMessage.text}
                    </div>
                  )}
                </form>
                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                      onClick={() => setIsLoginView(false)}
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 focus:outline-none"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
          ) : (
              <div>
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                  Create an Account
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
                  Join us and start your journey
                </p>
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        id="signup-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Full Name"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Email address"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        id="signup-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Password"
                    />
                  </div>
                  <div>
                    <button
                        type="submit"
                        disabled={isSignupLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSignupLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                  </div>
                  {signupMessage.text && (
                    <div className={`mt-4 p-3 rounded-md ${signupMessage.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {signupMessage.text}
                    </div>
                  )}
                </form>
                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                      onClick={() => setIsLoginView(true)}
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 focus:outline-none"
                  >
                    Sign In
                  </button>
                </p>
              </div>
          )}
        </div>
      </div>
  );
}
