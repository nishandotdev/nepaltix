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
    document.title = 'NepalTix - Your Gateway to Nepal\'s Best Events';
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedEvents />

        <section className="py-16 bg-white/80 dark:bg-gray-800/80 backdrop-filter backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <AnimatedSection className="order-2 lg:order-1" type="fade-right">
                <span className="inline-block px-3 py-1 text-xs font-medium text-nepal-red bg-nepal-red/10 rounded-full mb-4">
                  Why Choose Us
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                  The Perfect Way to Experience Nepal
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  NepalTix offers a seamless booking experience for the most authentic and exciting events across Nepal.
                </p>
                
                <div className="space-y-4">
                  <AnimatedSection delay={300} type="fade-up">
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-nepal-red/10 flex items-center justify-center">
                        <span className="text-nepal-red font-bold">01</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Curated Experiences</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          We handpick the best events to ensure quality experiences for our customers.
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                  
                  <AnimatedSection delay={400} type="fade-up">
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-nepal-red/10 flex items-center justify-center">
                        <span className="text-nepal-red font-bold">02</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Secure Booking</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Easy payment options with guaranteed secure transactions.
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                  
                  <AnimatedSection delay={500} type="fade-up">
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-nepal-red/10 flex items-center justify-center">
                        <span className="text-nepal-red font-bold">03</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Local Support</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Our team of local experts is always ready to assist you.
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedSection>
              
              <AnimatedSection className="order-1 lg:order-2" type="fade-left">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {/* Previous main large image: Nepal festival/cultural */}
                    <img 
                      src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                      alt="Traditional Nepali Festival"
                      className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg w-48 h-48 md:w-64 md:h-64 transform hover:translate-y-2 hover:translate-x-2 transition-transform duration-300">
                    {/* Previous smaller pop image: Nepali cultural performance */}
                    <img 
                      src="https://images.unsplash.com/photo-1565073475228-8a77b3f3a069?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3"
                      alt="Nepali Cultural Performance"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-6 -left-6 glass-card rounded-lg p-4 hidden sm:block backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                    <p className="font-medium text-gray-900 dark:text-white">Explore Nepal's Festivals</p>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-nepal-red font-medium">500+ events yearly</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
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
                <a 
                  href="/events"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-nepal-red text-white font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg group"
                >
                  Browse Events
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </AnimatedSection>
            </div>
          </InteractiveBackground>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
