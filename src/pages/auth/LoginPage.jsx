import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600 inline-block mb-2">Mini Blog</Link>
          <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Please enter your details to sign in.</p>
        </div>
        
        <p className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
          LoginPage (Placeholder)
        </p>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
