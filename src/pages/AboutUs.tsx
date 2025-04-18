
import Layout from "../components/Layout";
import { Helmet } from "react-helmet";

const AboutUs = () => {
  return (
    <Layout>
      <Helmet>
        <title>About Us | ChartPulse</title>
        <meta name="description" content="Learn about ChartPulse - an advanced crypto analysis platform helping traders make informed decisions with real-time data and AI-powered insights." />
        <meta name="keywords" content="about ChartPulse, crypto analysis team, trading experts, blockchain analysis, cryptocurrency experts" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">About ChartPulse</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Our Mission</h2>
            <p>
              ChartPulse was founded with a clear mission: to democratize access to professional-grade crypto market analysis tools. 
              We believe that every trader, regardless of experience level or portfolio size, deserves access to powerful analytical 
              resources that were once available only to institutional investors.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Our Story</h2>
            <p className="mb-3">
              ChartPulse began in 2025 when a group of crypto traders, data scientists, and software engineers came together with a 
              shared frustration: existing market analysis tools either lacked depth, were prohibitively expensive, or too complex 
              for the average trader to use effectively.
            </p>
            <p>
              After months of development and testing with a community of dedicated beta users, ChartPulse was born – combining 
              sophisticated technical analysis with an intuitive interface that both novice and experienced traders can benefit from.
            </p>
          </section>
          
          <section className="flex flex-col md:flex-row gap-6 items-center my-8">
            <div className="w-full md:w-1/2 aspect-video rounded-lg overflow-hidden glass-panel p-1">
              <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Trading team analyzing charts" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-lg font-medium text-foreground">Our Team</h3>
              <p>
                We're a diverse team of 3+ professionals spanning three continents, bringing together expertise in 
                cryptocurrency markets, machine learning, data visualization, and software engineering. Many of our team 
                members have backgrounds in quantitative finance and have previously worked at major financial institutions 
                and trading firms.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Our Technology</h2>
            <p className="mb-3">
              ChartPulse leverages cutting-edge technologies to provide real-time market insights:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Advanced Pattern Recognition:</strong> Our algorithms can identify over 40 different chart patterns as they form.</li>
              <li><strong>Real-time Data Processing:</strong> We process millions of data points per second from multiple exchanges.</li>
              <li><strong>Machine Learning Models:</strong> Our proprietary models continuously learn from market movements to improve prediction accuracy.</li>
              <li><strong>Backtesting Engine:</strong> All strategies can be tested against historical data to validate their effectiveness.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="font-medium mb-2 text-primary">Transparency</h3>
                <p>We believe in complete transparency in how our analytics work. We don't hide our methodologies behind "proprietary" labels.</p>
              </div>
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="font-medium mb-2 text-primary">Accessibility</h3>
                <p>Complex market analysis should be accessible to everyone, not just those with technical backgrounds.</p>
              </div>
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="font-medium mb-2 text-primary">Community</h3>
                <p>We grow and improve through community feedback and believe in fostering a collaborative trading environment.</p>
              </div>
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="font-medium mb-2 text-primary">Integrity</h3>
                <p>We present market analysis without bias. We don't promote coins or tokens, and we don't manipulate data.</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="mb-3">
              We'd love to hear from you! Whether you have questions, feedback, or partnership inquiries:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email:</strong> chartlyaiteam@gmail.com</li>
              {/* <li><strong>Twitter:</strong> @ChartPulseApp</li> */}
              {/* <li><strong>Discord:</strong> Join our community at discord.gg/chartpulse</li> */}
            </ul>
          </section>
          
          <p className="text-sm text-muted-foreground/70 mt-8">
            ChartPulse is committed to helping you navigate the complex world of cryptocurrency markets with confidence.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
