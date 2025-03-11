
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Ticket } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-3 shadow-soft' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-nepal-red"
          >
            <Ticket className="h-6 w-6" />
            <span className="font-serif text-xl font-bold tracking-tight">
              NepalTix
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/events" label="Events" />
            <NavLink to="/about" label="About" />
            <NavLink to="/contact" label="Contact" />
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/checkout"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isScrolled
                  ? 'bg-nepal-red text-white hover:bg-opacity-90'
                  : 'bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 hover:bg-white/30'
              }`}
            >
              Book Tickets
            </Link>
          </div>

          <button 
            className="md:hidden text-nepal-red"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg absolute top-full left-0 right-0 shadow-lg animate-fade-in border-t border-gray-100 dark:border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <MobileNavLink to="/" label="Home" />
            <MobileNavLink to="/events" label="Events" />
            <MobileNavLink to="/about" label="About" />
            <MobileNavLink to="/contact" label="Contact" />
            <Link
              to="/checkout"
              className="block w-full text-center px-4 py-3 mt-4 rounded-full text-sm font-medium bg-nepal-red text-white hover:bg-opacity-90 transition-all duration-300"
            >
              Book Tickets
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink = ({ to, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 ${
        isActive 
          ? 'text-nepal-red' 
          : 'text-gray-700 dark:text-gray-300 hover:text-nepal-red dark:hover:text-nepal-red'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-nepal-red rounded-full transform animate-scale-up" />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-gray-100 dark:bg-gray-800 text-nepal-red' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-nepal-red dark:hover:text-nepal-red'
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;
