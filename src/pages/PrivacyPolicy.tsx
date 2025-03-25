
import Layout from "../components/Layout";
import { Helmet } from "react-helmet";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | ChartPulse</title>
        <meta name="description" content="ChartPulse Privacy Policy - Learn how we collect, use, and protect your personal information while using our crypto analysis platform." />
        <meta name="keywords" content="privacy policy, ChartPulse, data protection, user privacy, crypto trading platform" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              Welcome to ChartPulse ("we," "our," or "us"). We are committed to protecting your privacy and providing you with a secure experience. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, and other contact details you provide when creating an account.</li>
              <li><strong>Usage Data:</strong> Information about how you use our platform, including search queries, viewed charts, and interaction with features.</li>
              <li><strong>Device Information:</strong> Information about your device, browser type, IP address, and operating system.</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience and collect data about usage patterns.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the collected information for various purposes, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Improving and personalizing user experience</li>
              <li>Processing transactions and managing subscriptions</li>
              <li>Sending you notifications, updates, and promotional content</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Analyzing usage patterns to improve our platform</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Sharing and Disclosure</h2>
            <p className="mb-3">We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party vendors who help us provide our services.</li>
              <li><strong>Business Partners:</strong> Companies we collaborate with to offer joint services or promotions.</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have rights regarding your personal data, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accessing your personal information</li>
              <li>Correcting inaccurate information</li>
              <li>Deleting your personal information</li>
              <li>Objecting to certain processing activities</li>
              <li>Data portability</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@chartpulse.com.
            </p>
          </section>
          
          <p className="text-sm text-muted-foreground/70 mt-8">Last Updated: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
