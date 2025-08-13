
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "TicketNepal - Privacy Policy";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, purchase tickets, or contact us for support.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and for other purposes as described in this policy.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
            <p>We may share your information with event organizers to facilitate ticket purchases and event access. We do not sell your personal information to third parties.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>We use reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
            <p>You may update, correct, or delete your account information at any time by logging into your account settings.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@nepaltix.np.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
