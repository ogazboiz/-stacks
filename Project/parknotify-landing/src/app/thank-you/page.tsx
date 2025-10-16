"use client";

import Link from "next/link";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1877F2] via-[#1A73E1] to-[#263163] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-2xl">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#1877F2] mb-6">
            Welcome to ParkNotify! 🚗
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Thank you for joining our waitlist! Please check your email to confirm your subscription and complete the signup process.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#1877F2] mb-3">📧 Check Your Email</h2>
            <p className="text-gray-700 mb-4">We&apos;ve sent you a confirmation email. Click the link in the email to complete your subscription.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Can&apos;t find the email?</strong> Check your spam folder or promotions tab. The email might take a few minutes to arrive.
              </p>
            </div>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#1877F2] rounded-full mr-3"></span>
                After confirming, you&apos;ll be notified when ParkNotify launches in your city
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#1877F2] rounded-full mr-3"></span>
                Get early access and exclusive updates
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#1877F2] rounded-full mr-3"></span>
                Help us build the perfect solution for African drivers
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">Follow us for updates:</p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://x.com/AkpoloOgaga" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:text-[#1A73E1] transition-colors"
                aria-label="Follow ParkNotify on Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-2">@AkpoloOgaga</p>
          </div>
          
          {/* Back to Home */}
          <Link 
            href="/"
            className="inline-block bg-[#1877F2] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#1A73E1] transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
