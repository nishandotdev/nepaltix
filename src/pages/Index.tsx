import { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedEvents from '@/components/FeaturedEvents';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowRight, CheckCircle, Zap, Globe, Mountain, Users, Calendar } from 'lucide-react';
import nepalMountains from '@/assets/nepal-mountains.jpg';
import nepalFestival from '@/assets/nepal-festival.jpg';
import kathmanduCity from '@/assets/kathmandu-city.jpg';
const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Ticket Nepal - Your Gateway to Nepal\'s Best Events';
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedEvents />

        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection type="fade-up" className="text-center mb-16">
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-nepal-red bg-nepal-red/10 border border-nepal-red/20 rounded-full mb-6">
                <CheckCircle className="w-4 h-4 mr-2" />
                Why Choose Ticket Nepal
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                Your Gateway to <span className="text-nepal-red">Nepal's Best</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Experience authentic Nepal through carefully curated events, festivals, and adventures that showcase the true spirit of our beautiful nation.
              </p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <AnimatedSection delay={200} type="fade-up">
                <div className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-nepal-red/20">
                  <div className="absolute top-0 left-8 w-12 h-1 bg-gradient-to-r from-nepal-red to-orange-500 rounded-full"></div>
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nepal-red/10 to-orange-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-8 h-8 text-nepal-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Verified Events</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Every event is carefully vetted by our local team to ensure authentic, high-quality experiences.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={300} type="fade-up">
                <div className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-nepal-red/20">
                  <div className="absolute top-0 left-8 w-12 h-1 bg-gradient-to-r from-nepal-red to-orange-500 rounded-full"></div>
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nepal-red/10 to-orange-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-nepal-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Instant Booking</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Secure your spot in seconds with our streamlined booking process and instant confirmation.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={400} type="fade-up">
                <div className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-nepal-red/20">
                  <div className="absolute top-0 left-8 w-12 h-1 bg-gradient-to-r from-nepal-red to-orange-500 rounded-full"></div>
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nepal-red/10 to-orange-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-8 h-8 text-nepal-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Local Expertise</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Backed by deep local knowledge and cultural understanding from our Nepal-based team.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection type="fade-up" className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Discover the Beauty of <span className="text-nepal-red">Nepal</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From majestic mountains to vibrant cultural festivals, experience the best of Nepal
              </p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <AnimatedSection delay={200} type="fade-up">
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src={nepalMountains} 
                    alt="Nepal Himalayas" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center mb-2">
                      <Mountain className="w-5 h-5 mr-2 text-nepal-red" />
                      <span className="text-sm font-medium">Adventure</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Himalayan Adventures</h3>
                    <p className="text-sm opacity-90">Trek through world's highest peaks</p>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={300} type="fade-up">
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src={nepalFestival} 
                    alt="Nepal Festival" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 mr-2 text-nepal-red" />
                      <span className="text-sm font-medium">Culture</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Cultural Festivals</h3>
                    <p className="text-sm opacity-90">Experience authentic traditions</p>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={400} type="fade-up">
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src={kathmanduCity} 
                    alt="Kathmandu City" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 mr-2 text-nepal-red" />
                      <span className="text-sm font-medium">Events</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">City Events</h3>
                    <p className="text-sm opacity-90">Modern celebrations in historic cities</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-nepal-red via-red-600 to-orange-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='3'/%3E%3Ccircle cx='53' cy='7' r='3'/%3E%3Ccircle cx='7' cy='53' r='3'/%3E%3Ccircle cx='53' cy='53' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection type="zoom-in">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6 text-white">
                Ready to Experience Nepal?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of adventurers and culture enthusiasts who discover amazing experiences every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/events" 
                  className="inline-flex items-center px-8 py-4 rounded-full bg-white text-nepal-red font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl group"
                >
                  Browse All Events
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Index;