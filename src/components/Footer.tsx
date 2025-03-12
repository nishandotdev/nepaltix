
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Ticket } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <Ticket className="h-6 w-6 text-nepal-red" />
              <span className="font-serif text-xl font-bold tracking-tight">
                NepalTix
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-4 max-w-xs">
              Your gateway to Nepal's most exciting events. Discover, book, and experience the best of what Nepal has to offer.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} label="Facebook" />
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} label="Instagram" />
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
              <SocialLink href="#" icon={<Youtube className="h-4 w-4" />} label="Youtube" />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/events" label="Events" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/contact" label="Contact" />
              <FooterLink to="/terms" label="Terms & Conditions" />
              <FooterLink to="/privacy" label="Privacy Policy" />
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white text-lg mb-4">Event Categories</h3>
            <ul className="space-y-2.5">
              <FooterLink to="/events?category=MUSIC" label="Music" />
              <FooterLink to="/events?category=CULTURE" label="Cultural" />
              <FooterLink to="/events?category=FESTIVAL" label="Festivals" />
              <FooterLink to="/events?category=SPORTS" label="Sports" />
              <FooterLink to="/events?category=FOOD" label="Food & Drink" />
              <FooterLink to="/events?category=ADVENTURE" label="Adventure" />
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 text-nepal-red mr-3 flex-shrink-0" />
                <span className="text-sm">Thamel, Kathmandu, Nepal</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-nepal-red mr-3 flex-shrink-0" />
                <span className="text-sm">+977 1 4123456</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-nepal-red mr-3 flex-shrink-0" />
                <span className="text-sm">info@nepaltix.np</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} NepalTix. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Nepal_map_flag.png" 
              alt="Made in Nepal" 
              className="h-6 opacity-70 hover:opacity-100 transition-opacity duration-300" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  label: string;
}

const FooterLink = ({ to, label }: FooterLinkProps) => (
  <li>
    <Link 
      to={to}
      className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
    >
      {label}
    </Link>
  </li>
);

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <a 
    href={href}
    aria-label={label}
    className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-nepal-red text-gray-300 hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
