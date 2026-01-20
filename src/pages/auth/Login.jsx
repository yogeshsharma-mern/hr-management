import React, { useState } from 'react';
import apiPath from '../../api/apiPath';
import { apiPost } from '../../api/apiFetch';
import { useMutation } from '@tanstack/react-query';
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaRocket } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { loginSuccess } from "../../features/auth/authSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

  // Mutation for login
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      return await apiPost(apiPath.hrLogin, credentials);
    },
    onSuccess: (data) => {
        // toast.success(data?.message || 'Login successful!');
        console.log("data",data.data);
         dispatch(loginSuccess({ user: data?.data?.hr, token: data?.data?.token }));
        toast.success(data?.message);
        navigate("/hr/dashboard");
    },
    onError: (error) => {
        toast.error(error?.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleAuth = () => {
    // Implement Google OAuth logic here
    alert('Google authentication would be implemented here');
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Top Navigation */}
      {/* <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaRocket className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                RenderWonders
              </h1>
              <p className="text-xs text-gray-500">by Hatypo Studio</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Available for work
            </span>
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Follow
            </button>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 hidden lg:block">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
        Hr Mangement <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">For, interview,</span> and <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Talent Insights</span>.
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A complete HRM platform that enables HR teams to create job openings, manage candidates, review documents, track interviewer skills, and conduct structured interviews — all in one place.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">🎨</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hr Magement</h3>
                  <p className="text-gray-600 leading-relaxed">
Post job openings, track candidates, review documents, and manage interviewer skills seamlessly with a powerful HR management system.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-blue-50">
                <h4 className="font-semibold text-gray-900 mb-4">Login the dashboard to explore features</h4>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className="w-12 h-12 rounded-full border-3 border-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, var(--gradient-${i}-start), var(--gradient-${i}-end))`
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-700">100+</div>
                    <div className="text-sm text-gray-500">Active HRM's</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md mx-auto border border-blue-50">
              <div className="text-center mb-10">
                <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaRocket className="text-white text-3xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Welcome to Hr Mangement
                </h2>
                <p className="text-gray-500">
                  Sign in to access your professional HRM
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="professional@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaLock className="mr-2 text-blue-500" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 pr-12"
                      placeholder="Enter your password"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-blue-100"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-4 bg-white text-gray-700 hover:bg-gray-50 font-semibold py-3.5 px-4 rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow"
                >
                  <FaGoogle className="text-red-500 text-xl" />
                  Sign in with Google
                </button> */}

                <div className="text-center pt-6 border-t border-blue-50">
                  <p className="text-gray-600">
                    Need help?{' '}
                    <a href="mailto:hello@hatypo.studio" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  hr@waplia.in
                    </a>
                  </p>
                </div>
              </form>
            </div>

            {/* Stats Section */}
 
          </div>
        </div>
      </div>

      {/* Footer */}


      <style jsx>{`
        :root {
          --gradient-1-start: #3B82F6;
          --gradient-1-end: #06B6D4;
          --gradient-2-start: #8B5CF6;
          --gradient-2-end: #EC4899;
          --gradient-3-start: #10B981;
          --gradient-3-end: #3B82F6;
          --gradient-4-start: #F59E0B;
          --gradient-4-end: #EF4444;
          --gradient-5-start: #6366F1;
          --gradient-5-end: #8B5CF6;
        }
      `}</style>
    </div>
  );
}