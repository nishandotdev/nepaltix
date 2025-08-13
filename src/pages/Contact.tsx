
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "TicketNepal - Contact Us";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Your message has been sent! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-nepal-red/10 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Contact Us</h1>
              <p className="text-lg md:text-xl text-gray-700">
                Get in touch with our team for any questions, feedback, or support.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-6">Reach Out To Us</h2>
                  
                  <div className="space-y-8">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div className="bg-nepal-red/10 p-3 rounded-full">
                            <MapPin className="h-6 w-6 text-nepal-red" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">Our Office</h3>
                            <p className="text-gray-600 mt-1">Thamel, Kathmandu, Nepal</p>
                            <p className="text-gray-600">Near Garden of Dreams</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div className="bg-nepal-red/10 p-3 rounded-full">
                            <Phone className="h-6 w-6 text-nepal-red" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">Phone</h3>
                            <p className="text-gray-600 mt-1">+977 1 4123456</p>
                            <p className="text-gray-600">+977 9812345678</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div className="bg-nepal-red/10 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-nepal-red" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">Email</h3>
                            <p className="text-gray-600 mt-1">info@nepaltix.np</p>
                            <p className="text-gray-600">support@nepaltix.np</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div className="bg-nepal-red/10 p-3 rounded-full">
                            <Clock className="h-6 w-6 text-nepal-red" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">Business Hours</h3>
                            <p className="text-gray-600 mt-1">Sunday-Friday: 9:00 AM - 6:00 PM</p>
                            <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-6">Send Us a Message</h2>
                  
                  <Card>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="John Doe" 
                            required 
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input 
                            id="subject" 
                            name="subject" 
                            placeholder="How can we help you?" 
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea 
                            id="message" 
                            name="message" 
                            placeholder="Your message here..." 
                            rows={5} 
                            required
                            value={formData.message}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-nepal-red hover:bg-nepal-red/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>Sending Message...</>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-serif font-bold mb-6 text-center">Our Location</h2>
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.122613025609!2d85.30943621438513!3d27.71475798148176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fcb77fd4f7%3A0x58099b8d37a4660e!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1626771234567!5m2!1sen!2snp" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="TicketNepal Office Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
