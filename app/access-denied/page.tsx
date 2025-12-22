export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-md w-full glass-dark rounded-2xl p-8 text-center border border-gray-700/50 shadow-2xl">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="h-10 w-10 text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
        <p className="text-gray-300 mb-6">
          This is an admin-only system. Only authorized personnel can access the Mission CMS.
        </p>
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-400">
            If you need access, please contact your system administrator.
          </p>
        </div>
        <a 
          href="/sign-in"
          className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20"
        >
          Back to Sign In
        </a>
      </div>
    </div>
  );
}
