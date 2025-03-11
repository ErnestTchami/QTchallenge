import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <nav className="bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-indigo-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Shortify
              </h1>
            </div>
            <div className="flex items-center  space-x-3">
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl drop-shadow-sm">
            Shorten Your URLs
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-indigo-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create short links for your long URLs. Track clicks and manage your
            links all in one place.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              href="/register"
              className="px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl ring-1 ring-indigo-900/5 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
