
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Send, User } from "lucide-react";
import { useState } from "react";

const ContactUs = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a backend
    toast({
      title: "Message sent",
      description: "Thank you for reaching out. We'll get back to you shortly.",
    });
    
    // Reset form
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="mb-6 px-4 py-5 rounded-lg glass-panel animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                  <Input 
                    id="subject" 
                    placeholder="Enter subject" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Type your message here" 
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="mb-6 px-4 py-5 rounded-lg glass-panel animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                  About ChartPulse Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">
                  At ChartPulse, we're dedicated to providing exceptional support to our users. Our team of 
                  cryptocurrency and technical analysis experts is available to answer your questions and help
                  you make the most of our advanced trading analysis platform.
                </p>
                <div className="flex items-center gap-4 mb-4 p-3 bg-secondary/20 rounded-lg">
                  <MessageSquare className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-medium">Fast Responses</h3>
                    <p className="text-sm">We aim to respond to all inquiries within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="px-4 py-5 rounded-lg glass-panel animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                  Comprehensive Support Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  ChartPulse is committed to helping traders of all experience levels succeed in the cryptocurrency 
                  markets. Our platform combines real-time data with AI-powered insights to provide you with the 
                  most accurate and actionable trading information.
                </p>
                
                <h3 className="font-medium mb-2">Why Contact ChartPulse Support?</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                  <li>Technical assistance with platform features</li>
                  <li>Subscription and billing inquiries</li>
                  <li>Feature requests and feedback</li>
                  <li>Partnership opportunities</li>
                  <li>Educational resources and guidance</li>
                </ul>
                
                <h3 className="font-medium mb-2">Our Commitment to You</h3>
                <p className="text-muted-foreground mb-4">
                  When you reach out to ChartPulse support, you can expect personalized assistance from our team 
                  of experts who understand the complexities of cryptocurrency trading and technical analysis. We're 
                  here to ensure you have the best possible experience using our platform.
                </p>
                
                <p className="text-muted-foreground">
                  Whether you're experiencing technical issues, have questions about our services, or simply want 
                  to provide feedback, we value your input and are committed to continually improving our platform 
                  based on user needs. Our goal is to empower traders with the tools and insights they need to make 
                  informed decisions in the volatile crypto markets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="mt-8 px-4 py-5 rounded-lg glass-panel animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">
              Frequently Asked Support Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">How do I upgrade my subscription?</h3>
                <p className="text-muted-foreground mb-4">
                  Upgrading your ChartPulse subscription is simple. Navigate to the Subscription page from your 
                  dashboard, select your preferred plan, and follow the payment instructions. Your account will 
                  be instantly upgraded, providing immediate access to premium features.
                </p>
                
                <h3 className="font-medium mb-2">Can I get a refund if I'm not satisfied?</h3>
                <p className="text-muted-foreground mb-4">
                  ChartPulse offers a 7-day satisfaction guarantee for new subscribers. If you're not completely 
                  satisfied with our service within the first week, contact our support team to request a full refund. 
                  We're confident in our platform's value but understand that it might not be the perfect fit for everyone.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">How accurate are ChartPulse's trading signals?</h3>
                <p className="text-muted-foreground mb-4">
                  ChartPulse's trading signals are derived from a combination of technical indicators, pattern 
                  recognition algorithms, and market data analysis. While our system has a high accuracy rate, 
                  it's important to remember that no trading signal service can guarantee results in the volatile 
                  cryptocurrency markets. We recommend using our signals as part of a comprehensive trading strategy.
                </p>
                
                <h3 className="font-medium mb-2">Can I access ChartPulse on mobile devices?</h3>
                <p className="text-muted-foreground">
                  Yes, ChartPulse is fully responsive and optimized for mobile devices. You can access all features 
                  of our platform from your smartphone or tablet's web browser. We're also developing dedicated mobile 
                  applications for iOS and Android to enhance the mobile trading experience further.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ContactUs;
