import { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedEvents from '@/components/FeaturedEvents';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AnimatedSection from '@/components/AnimatedSection';
import InteractiveBackground from '@/components/InteractiveBackground';
import { ArrowRight } from 'lucide-react';
const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Ticket Nepal - Your Gateway to Nepal\'s Best Events';
  }, []);
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedEvents />

        <section className="py-16 bg-white/80 dark:bg-gray-800/80 backdrop-filter backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection type="fade-up">
              <span className="inline-block px-3 py-1 text-xs font-medium text-nepal-red bg-nepal-red/10 rounded-full mb-4">
                Why Choose Ticket Nepal
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Your Gateway to Nepal's Best Events
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Ticket Nepal provides seamless access to authentic cultural experiences, adventure activities, and festivals across the beautiful nation of Nepal.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <AnimatedSection delay={300} type="fade-up">
                  <div className="p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-nepal-red/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-nepal-red font-bold text-xl">✓</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Verified Events</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      All events are carefully vetted for authenticity and quality.
                    </p>
                  </div>
                </AnimatedSection>
                
                <AnimatedSection delay={400} type="fade-up">
                  <div className="p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-nepal-red/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-nepal-red font-bold text-xl">⚡</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Instant Booking</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Quick and secure ticket booking with immediate confirmation.
                    </p>
                  </div>
                </AnimatedSection>
                
                <AnimatedSection delay={500} type="fade-up">
                  <div className="p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-nepal-red/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-nepal-red font-bold text-xl">🇳🇵</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Local Expertise</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Backed by local knowledge and cultural understanding.
                    </p>
                  </div>
                </AnimatedSection>
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        <section className="py-16 relative overflow-hidden">
          <InteractiveBackground>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
              <AnimatedSection type="zoom-in">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-nepal-red">
                  Ready to Experience Nepal's Best Events?
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of visitors and locals who find and book amazing experiences every day.
                </p>
                <a href="/events" className="inline-flex items-center px-8 py-4 rounded-full bg-nepal-red text-white font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg group">
                  Browse Events
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </AnimatedSection>
            </div>
          </InteractiveBackground>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Index;