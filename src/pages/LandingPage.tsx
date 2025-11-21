
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, Lock, Users, BarChart3, ArrowRight, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">CypherEyes</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-gray-700 hover:text-blue-500 text-sm font-medium transition-colors">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-500 text-sm font-medium transition-colors">
                  About us
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-500 text-sm font-medium transition-colors">
                  Services
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-500 text-sm font-medium transition-colors">
                  Contact us
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-500 text-sm font-medium transition-colors">
                  Blog
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-blue-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                We create
                <br />
                <span className="text-blue-500">solutions</span> for
                <br />
                your business
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                Our team keeps a pace that is an emerging market
                of business firms. We are happy to develop dynamic
                campaigns without cutting-edge.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all inline-flex items-center shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <div className="mt-6">
                <button className="text-blue-500 font-medium text-sm flex items-center hover:text-blue-600 transition-colors">
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Explore More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                {/* Hero Illustration Placeholder */}
                <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-24 h-24 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">Network Security</h3>
                    <p className="text-gray-600 mt-2">AI-Powered Protection</p>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-indigo-300 rounded-full opacity-60"></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-blue-500 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We Provide The Best <span className="text-blue-500">Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're prepared to offer services to
              <br />
              each of your requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">
                Advanced network traffic analysis and threat detection with real-time insights.
              </p>
              <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                Read More →
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive security marketing solutions for your business growth.
              </p>
              <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                Read More →
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Campaign</h3>
              <p className="text-sm text-gray-600 mb-4">
                Strategic web campaigns to enhance your security awareness programs.
              </p>
              <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                Read More →
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Others</h3>
              <p className="text-sm text-gray-600 mb-4">
                Custom security solutions tailored to your specific business needs.
              </p>
              <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                Read More →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Solutions Section */}
      <div className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Illustration Placeholder */}
              <div className="bg-gradient-to-br from-blue-200 to-indigo-300 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                  <div className="text-lg font-semibold text-gray-800">Secure Solutions</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Simple <span className="text-blue-500">Solutions!</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We understand that no two businesses
                are alike. That's why we build the
                future of your firm.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contact us</h4>
                    <p className="text-sm text-gray-600">Get in touch for security consultation</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Consult</h4>
                    <p className="text-sm text-gray-600">Discuss your security requirements</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Place order</h4>
                    <p className="text-sm text-gray-600">Start your security implementation</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Payment</h4>
                    <p className="text-sm text-gray-600">Secure and flexible payment options</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Get Started
                </button>
                <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all">
                  Read more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-blue-500">Agency</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe in the power of data. Our
                analysts driven approach allows us to make
                business decisions that deliver success.
                <br /><br />
                Prioritize and optimize your marketing
                efforts for maximum ROI. Let's turn your
                security challenges into opportunities and
                explore solutions for your business.
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg">
                Read more
              </button>
            </div>
            <div className="relative">
              {/* Charts Illustration Placeholder */}
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                  <div className="text-lg font-semibold text-gray-800">Analytics Dashboard</div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-indigo-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What <span className="text-blue-500">Clients</span> Say!
            </h2>
            <p className="text-lg text-gray-600">
              See how our Digital Marketing Agency partners
              with clients to achieve shared goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">John Smith</h4>
                  <p className="text-sm text-gray-600">CEO, Tech Corp</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "CypherEyes transformed our network security. The AI-powered detection caught threats we never would have seen."
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">CTO, StartupXYZ</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Implementation was seamless and the dashboard provides incredible insights into our network traffic patterns."
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Mike Davis</h4>
                  <p className="text-sm text-gray-600">IT Director, Enterprise Inc</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The real-time alerts and automated responses have significantly improved our security response time."
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to get started?
          </h2>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-500 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg"
          >
            CONTACT US
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">CypherEyes</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-500">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Services</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Team</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Career</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Web design</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Web development</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">E-Commerce</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Become a partner</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Go to Webflow</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Privacy policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Term & Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-200 mt-8 pt-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-4 rounded-lg">
              <p className="font-semibold">&copy; 2025 CypherEyes. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

