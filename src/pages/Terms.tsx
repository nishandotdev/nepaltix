
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "NepalTix - Terms & Conditions";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-6">Terms & Conditions</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>Welcome to NepalTix. These Terms of Service govern your use of our website and services offered by NepalTix.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptance of Terms</h2>
            <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Ticket Purchases</h2>
            <p>All ticket sales are final. Refunds or exchanges may be permitted in specific circumstances as outlined in our refund policy.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Organizer Terms</h2>
            <p>Event organizers must provide accurate information about their events. NepalTix reserves the right to remove events that violate our policies.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will provide notice of significant changes to these terms.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at info@nepaltix.np.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
