"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Store in localStorage (in production, send to backend)
    const signups = JSON.parse(localStorage.getItem("parknotify-signups") || "[]");
    signups.push({
      name,
      email,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("parknotify-signups", JSON.stringify(signups));

    console.log("New signup:", { name, email });
    console.log("Total signups:", signups.length);

    setSubmitted(true);
    setName("");
    setEmail("");

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="text-[#1877F2] text-2xl font-bold">ParkNotify</div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#about" className="text-gray-900 hover:text-[#1877F2] px-3 py-2 text-[16px] font-semibold transition-colors duration-300">About</a>
              <a href="#signup" className="bg-[#1877F2] text-white px-6 py-2 rounded-lg hover:bg-[#1A73E1] transition-all duration-300 text-[16px] font-semibold shadow-lg">
                Join Waitlist
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="text-gray-500 hover:text-[#1877F2] transition-colors duration-300"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-[#1877F2] via-[#1A73E1] to-[#263163] flex items-center relative pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Main Content - Full width on mobile, left column on desktop */}
            <div className="space-y-6 lg:space-y-8 relative z-20 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                Never Get<br />
                Blocked In<br />
                Again
              </h1>
              
              <p className="text-blue-100 text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 drop-shadow-md">
                Decentralized parking coordination for African cities. Contact car owners without sharing phone numbers.
              </p>
              
              <button 
                onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-[#1877F2] font-bold py-3 px-8 lg:py-4 lg:px-12 rounded-lg hover:bg-blue-50 transition-all duration-300 text-lg lg:text-xl shadow-xl"
              >
                Join the Waitlist
              </button>
            </div>

            {/* Right Column - Empty for car image overlay on desktop */}
            <div className="hidden lg:block relative z-20">
            </div>
          </div>
        </div>

        {/* Car Image - Absolute positioned to break out of grid - Hidden on mobile */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <img 
            src="/ccar.png" 
            alt="Car" 
            className="w-[1000px] h-[800px] object-contain drop-shadow-2xl "
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1877F2] mb-6">About ParkNotify</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We&apos;re building the future of parking coordination for African cities. 
              No more getting blocked in by cars with no way to contact the owner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Problem</h3>
              <p className="text-gray-600">
                You park your car, come back, and someone has parked behind you with no way to contact them. You&apos;re stuck waiting, sometimes for hours.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1A73E1] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Solution</h3>
              <p className="text-gray-600">
                Decentralized parking coordination that lets you contact car owners without sharing phone numbers publicly. Privacy-first design.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#263163] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For African Cities</h3>
              <p className="text-gray-600">
                Built specifically for the unique challenges of African cities like Lagos, Nairobi, and beyond. We understand the local context.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Email Signup */}
      <section id="signup" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1877F2] mb-6">Join the Waitlist</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Be the first to know when ParkNotify launches in your city. Get early access and help us build the perfect solution for African drivers.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-md mx-auto">
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Thanks for signing up!</span>
                </div>
                <p className="text-sm mt-1">We&apos;ll notify you when we launch.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1877F2] transition text-gray-900 placeholder-gray-500 bg-white hover:border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1877F2] transition text-gray-900 placeholder-gray-500 bg-white hover:border-gray-300"
                />
              </div>
              
              <button
                type="submit"
                className="w-full text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: '#1877F2' }}
              >
                Join Waitlist
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2024 ParkNotify. Building the future of parking coordination.
          </p>
        </div>
      </footer>
    </div>
  );
}
