
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedEvents from '@/components/FeaturedEvents';
import { events } from '@/data/events';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

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
        <FeaturedEvents events={events} />
        
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 animate-entrance">
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
                  <div className="flex">
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
                  
                  <div className="flex">
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
                  
                  <div className="flex">
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
                </div>
              </div>
              
              <div className="order-1 lg:order-2 animate-entrance-delay-1">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1585147457016-a838195bfa12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Nepali Festival" 
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg w-48 h-48 md:w-64 md:h-64">
                    <img 
                      src="https://images.unsplash.com/photo-1514037337613-ee3db0475f7f?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Nepali Music" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-6 -left-6 glass-card rounded-lg p-4 hidden sm:block">
                    <p className="font-medium text-gray-900">Explore Nepal's Festivals</p>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-nepal-red font-medium">500+ events yearly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-nepal-red text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Ready to Experience Nepal's Best Events?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of visitors and locals who find and book amazing experiences every day.
            </p>
            <a 
              href="/events"
              className="inline-block px-8 py-4 rounded-full bg-white text-nepal-red font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
            >
              Browse Events
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
