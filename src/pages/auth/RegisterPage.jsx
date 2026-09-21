import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600 inline-block mb-2">Mini Blog</Link>
          <h1 className="text-xl font-semibold text-gray-900">Create an account</h1>
          <p className="text-gray-500 text-sm mt-1">Start your blogging journey today.</p>
        </div>
        
        <p className="text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
          RegisterPage (Placeholder)
        </p>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
