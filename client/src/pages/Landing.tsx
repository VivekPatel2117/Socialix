import BackgroundSocial from '../assets/socialx-bg.jpeg';
import { Link } from 'react-router-dom';
const Landing = () => {
  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Socialix</h1>
          <nav className="space-x-4">
            <button className="bg-black text-white px-4 py-2 rounded-md">
             <Link to="/signup">Sign up</Link>
            </button>
          </nav>
        </div>
      </header>

      <section className="">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col gap-8 lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold mb-4">
              Connect, Share, and Inspire
            </h2>
            <p className="mb-6 text-lg">
              Join millions of users worldwide on Socialix. Share your moments, connect with friends, and explore a world of creativity.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-200">
             <Link to="/signup">Get Started</Link>
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <img
              src={BackgroundSocial}
              alt="Social Media Illustration"
              className="rounded-md shadow-lg h-3/4 w-3/4"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
