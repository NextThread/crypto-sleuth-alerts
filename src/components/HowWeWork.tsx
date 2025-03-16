
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Briefcase, LineChart, Microscope, Lock, TrendingUp } from "lucide-react";

const HowWeWork = () => {
  return (
    <Card className="glass-card w-full animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          How We Work
        </CardTitle>
        <CardDescription>
          Our unique approach to crypto analysis and trading
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5 transition-all hover:bg-secondary/30 hover:border-primary/20 hover:shadow-md">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Real-time Chart Analysis</h3>
            <p className="text-muted-foreground text-sm">
              We provide comprehensive draw analysis directly on real-time charts, with support/resistance levels, patterns, and entry/exit points all visualized as they form, giving you an edge others don't have.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5 transition-all hover:bg-secondary/30 hover:border-primary/20 hover:shadow-md">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Advanced Algorithms</h3>
            <p className="text-muted-foreground text-sm">
              Our proprietary algorithms analyze market patterns across multiple timeframes to identify high-probability trading opportunities before they become apparent to others.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5 transition-all hover:bg-secondary/30 hover:border-primary/20 hover:shadow-md">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Microscope className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Rigorous Backtesting</h3>
            <p className="text-muted-foreground text-sm">
              Every trading strategy we implement undergoes extensive backtesting against historical data, ensuring only proven methods with consistent results are recommended.
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-5 rounded-lg bg-primary/5 backdrop-blur-md border border-primary/20">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            What Makes Us Different
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Real-time visual analysis:</strong> We draw directly on charts in real-time, showing you exactly where key levels, patterns, and signals are forming as the market moves.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Unlike others, we don't just offer generic signals - our analysis includes specific entry points, targets, and protective stops.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Transparency is our priority: we publish all our past calls and their performance, whether successful or not.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>We combine technical analysis with on-chain metrics for a more comprehensive trading approach that considers both price action and network activity.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Our team includes experienced traders with over 10 years in traditional finance and 5+ years in crypto markets.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowWeWork;
