
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, CalendarDays, Ticket, Shield, MapPin, Clock, CreditCard, Heart } from "lucide-react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "NepalTix - About Us";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-nepal-red/10 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About NepalTix</h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Nepal's premier platform for discovering and booking tickets to the most exciting events across the country.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg mb-4">
                  Founded in 2023, NepalTix was born from a simple idea: to make discovering and attending events in Nepal easier for everyone.
                </p>
                <p className="text-lg mb-4">
                  Our founders, avid travelers and culture enthusiasts, noticed a gap in the market for a comprehensive platform that connects event organizers with attendees across Nepal.
                </p>
                <p className="text-lg mb-4">
                  Since our launch, we've helped thousands of people discover cultural festivals, music concerts, adventure competitions, and more throughout this beautiful country.
                </p>
                <p className="text-lg">
                  Today, NepalTix is the leading event ticketing platform in Nepal, partnering with organizers of all sizes to bring unforgettable experiences to our users.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
              <p className="text-xl mb-8">
                To connect Nepalis and visitors with the rich tapestry of events that showcase the country's vibrant culture, natural beauty, and entrepreneurial spirit.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Heart className="h-5 w-5 text-nepal-red mr-2" />
                    For Our Users
                  </h3>
                  <p>We strive to provide the most user-friendly platform to discover, book, and enjoy events across Nepal.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <User className="h-5 w-5 text-nepal-red mr-2" />
                    For Organizers
                  </h3>
                  <p>We empower event creators with tools to reach wider audiences and manage their events efficiently.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">Why Choose NepalTix</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="bg-nepal-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="h-8 w-8 text-nepal-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                  <p className="text-gray-600">Simple, fast ticket booking with secure payment options.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-nepal-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarDays className="h-8 w-8 text-nepal-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Diverse Events</h3>
                  <p className="text-gray-600">From cultural festivals to adventure sports, find it all here.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-nepal-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-nepal-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                  <p className="text-gray-600">Your data and transactions are always protected.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-nepal-red text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Ready to Experience Nepal's Best Events?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who discover and attend amazing events across Nepal every day.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/events">Explore Events</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                <Link to="/auth">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
