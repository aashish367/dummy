"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, MapPin, Phone, User, ShieldCheck, CheckCircle, Star, Award, ArrowRight, Zap, Shield, Timer, Wrench } from 'lucide-react';

export default function ClockRepairScheduling() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleScheduleClick = () => {
    // Navigate to scheduling page - you can replace this with your actual navigation
    window.location.href = '/clock-repair';
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+91 9911351462';
  };

  const features = [
    { icon: Timer, text: "Expert clock repair with 15+ years experience" },
    { icon: Calendar, text: "Flexible pickup scheduling to fit your schedule" },
    { icon: ShieldCheck, text: "100% satisfaction guarantee on all repairs" },
    { icon: Clock, text: "Expert vintage & modern clock restoration" }
  ];

  const processSteps = [
    { 
      icon: Phone, 
      title: "Book Online", 
      description: "Schedule your free pickup in under 2 minutes",
      color: "from-blue-400 to-blue-500"
    },
    { 
      icon: MapPin, 
      title: "We Pick Up", 
      description: "Free pickup from your home at your convenience",
      color: "from-green-400 to-green-500"
    },
    { 
      icon: Wrench, 
      title: "Expert Repair", 
      description: "Master craftsmen restore your timepiece",
      color: "from-purple-400 to-purple-500"
    },
    { 
      icon: Shield, 
      title: "Guaranteed Return", 
      description: "90-day warranty with free delivery back to you",
      color: "from-orange-400 to-orange-500"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 py-20 px-4 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full opacity-15 animate-bounce delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-10 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 animate-bounce">
            <Clock className="w-4 h-4" />
            Professional Clock Repair Service
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6 leading-tight">
            Your Timepiece
            <br />
            <span className="text-4xl md:text-6xl">Deserves Expert Care</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Trust our master clockmakers to restore your precious timepiece to perfect working condition. 
            We offer convenient pickup and delivery service with guaranteed satisfaction.
          </p>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handleScheduleClick}
              className="group bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <Calendar className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Schedule Free Pickup
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              onClick={handleCallClick}
              variant="outline"
              className="group border-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <Phone className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              Call Now: (+91) 9911351462
            </Button>
          </div>

          {/* Urgency Banner */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 border border-orange-200 text-orange-800 px-6 py-3 rounded-full text-sm font-medium animate-pulse">
            <Zap className="w-4 h-4 text-orange-600" />
            Limited Time: Free pickup for bookings this week!
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-orange-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-700 font-medium leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Testimonials & Trust Signals */}
          <div className={`space-y-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.9/5 Rating</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">What Our Customers Say</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl">
                  <p className="text-gray-700 italic mb-4">"Exceptional service! My grandfather's clock hadn't worked in years, and they brought it back to life perfectly. The pickup was so convenient!"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      MR
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Sukhbeer Singh</p>
                      <p className="text-sm text-gray-600">Verified Customer</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/70 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-orange-600">500+</div>
                    <div className="text-sm text-gray-600">Clocks Repaired</div>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-yellow-600">15+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-orange-600">97%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - How It Works Process */}
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  How It Works
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Simple 4-step process to get your clock running perfectly
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {processSteps.map((step, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">{step.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      </div>
                      <div className="text-2xl font-bold text-gray-300">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-xl text-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Ready to Get Started?</h4>
                  <p className="text-gray-600 mb-4">Your timepiece is just one click away from perfect timing</p>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={handleScheduleClick}
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Start Your Repair Journey
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <p className="text-sm text-gray-500">
                      Or call us directly at{' '}
                      <button 
                        onClick={handleCallClick}
                        className="text-orange-600 hover:text-orange-700 font-semibold underline"
                      >
                        (+91) 9911351462
                      </button>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA Strip */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Don't Let Time Stand Still</h3>
            <p className="text-lg mb-6 opacity-90">Your precious timepiece deserves expert care. Schedule your free pickup today!</p>
            <Button 
              onClick={handleScheduleClick}
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Clock className="w-5 h-5 mr-2" />
              Schedule Now - It's Free!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}