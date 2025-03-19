
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart2, Database, Users } from "lucide-react";

const AnalysisCounter = () => {
  const [activeTraders, setActiveTraders] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Set initial random active traders count
    updateActiveTraders();
    
    // Set up interval to update active traders count randomly every minute
    const tradersInterval = setInterval(() => {
      updateActiveTraders();
    }, 60000); // Update every minute

    return () => {
      clearInterval(tradersInterval);
    };
  }, []);

  const updateActiveTraders = () => {
    // Random value between 76 and 1800
    const randomTraders = Math.floor(Math.random() * (1800 - 76 + 1)) + 76;
    setActiveTraders(randomTraders);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  return (
    <Card className="glass-card w-full animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Global Analysis Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Analyses</p>
              <h3 className="text-2xl font-mono font-bold">
                50K+
              </h3>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Data Points Processed</p>
              <h3 className="text-2xl font-mono font-bold">
                300K+
              </h3>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Active Traders</p>
              <h3 className={`text-2xl font-mono font-bold ${isAnimating ? 'text-primary animate-pulse' : ''}`}>
                {activeTraders.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisCounter;
