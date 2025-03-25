
import Layout from "../components/Layout";
import { Helmet } from "react-helmet";

const TermsAndConditions = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms and Conditions | ChartPulse</title>
        <meta name="description" content="ChartPulse Terms and Conditions - Read our terms of service and user agreement for our crypto analysis platform." />
        <meta name="keywords" content="terms and conditions, user agreement, ChartPulse, crypto trading platform, legal terms" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ChartPulse ("the Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              ChartPulse is a crypto analysis platform that provides technical analysis tools, charting capabilities, and market insights. The Service is provided "as is" and "as available" without any warranties, expressed or implied.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p className="mb-3">When creating an account with us, you must provide accurate, complete, and current information. You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account and password</li>
              <li>Restricting access to your computer or device</li>
              <li>Accepting responsibility for all activities that occur under your account</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Subscription and Payments</h2>
            <p className="mb-3">
              Certain features of the Service require a subscription. By subscribing to our premium services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree to pay all fees associated with your subscription plan</li>
              <li>Payments are non-refundable except as required by law</li>
              <li>We reserve the right to change subscription fees upon reasonable notice</li>
              <li>Subscription automatically renews unless canceled before the renewal date</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
            <p>
              In no event shall ChartPulse, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. ChartPulse does not warrant that the Service will function uninterrupted, secure, or available at any particular time or location, or that any errors or defects will be corrected.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Not Financial Advice</h2>
            <p>
              Information provided through the Service is for informational and educational purposes only and is not intended as financial advice. Trading cryptocurrencies involves risk, and you should always conduct your own research and consult with a qualified financial advisor before making investment decisions.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by ChartPulse and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including, without limitation, if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ChartPulse is established, without regard to its conflict of law provisions.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@chartpulse.com.
            </p>
          </section>
          
          <p className="text-sm text-muted-foreground/70 mt-8">Last Updated: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;
