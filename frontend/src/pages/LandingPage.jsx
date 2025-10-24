import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Play,
  Shield,
  Users,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Multiple Personalities",
      description:
        "Choose from 6 unique waifu personalities, each with their own traits and stories",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Dynamic Interactions",
      description:
        "Your choices matter! Experience different moods and reactions based on your decisions",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achievements & Progress",
      description:
        "Unlock achievements, outfits, and special endings as you play",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Date System",
      description:
        "Go on virtual dates to various locations and build your relationship",
    },
  ];

  const waifuTypes = [
    {
      name: "Aiko",
      personality: "Sweet & Caring",
      icon: "💕",
      color: "from-pink-400 to-red-500",
    },
    {
      name: "Yuki",
      personality: "Cheerful & Energetic",
      icon: "❄️",
      color: "from-blue-400 to-cyan-500",
    },
    {
      name: "Sakura",
      personality: "Shy & Gentle",
      icon: "🌸",
      color: "from-pink-300 to-purple-400",
    },
    {
      name: "Mai",
      personality: "Friendly & Smiling",
      icon: "☀️",
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "Hana",
      personality: "Welcoming & Warm",
      icon: "🌺",
      color: "from-green-400 to-emerald-500",
    },
    {
      name: "Luna",
      personality: "Mysterious & Enigmatic",
      icon: "🌙",
      color: "from-purple-600 to-indigo-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              💕 Yandere AI Game
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Welcome to Yandere AI Game
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Experience an interactive visual novel where your choices shape
              the story. Build relationships with unique AI personalities and
              unlock multiple endings!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl"
              >
                <Play className="w-6 h-6" />
                <span>Start Playing Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="flex items-center space-x-2 px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl"
              >
                <Shield className="w-6 h-6" />
                <span>Admin Access</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-bounce">
          💕
        </div>
        <div className="absolute top-40 right-20 text-6xl animate-pulse">
          🌸
        </div>
        <div className="absolute bottom-20 left-20 text-6xl animate-bounce delay-300">
          ✨
        </div>
        <div className="absolute bottom-40 right-10 text-6xl animate-pulse delay-500">
          💝
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Game Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Characters Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Meet Your Waifus
          </h2>
          <p className="text-center text-gray-700 mb-12 text-lg">
            Choose from 6 unique personalities, each with their own story and
            traits
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {waifuTypes.map((waifu, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div
                  className={`bg-gradient-to-r ${waifu.color} rounded-xl p-6 mb-4 text-center`}
                >
                  <div className="text-6xl mb-2">{waifu.icon}</div>
                  <h3 className="text-2xl font-bold text-white">
                    {waifu.name}
                  </h3>
                </div>
                <p className="text-center text-gray-700 font-medium">
                  {waifu.personality}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Create your account now and dive into an unforgettable interactive
            experience!
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Yandere AI Game. Created for ICE415 - Professional Elective 5
            (USeP)
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <button
              onClick={() => navigate("/login")}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/admin/login")}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
