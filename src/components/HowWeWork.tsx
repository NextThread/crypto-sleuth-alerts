
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Lightbulb, TrendingUp, Activity, Clock, ChartBar, Cpu, BarChart3, BarChart4, Sigma, ChartPie, Presentation } from "lucide-react";

const HowWeWork = () => {
  const [activeTab, setActiveTab] = useState("approach");
  
  const features = [
    {
      icon: <LineChart className="h-5 w-5 text-primary" />,
      title: "Real-time Chart Analysis",
      description: "Experience full-scale drawing analysis directly on real-time price charts, identifying key patterns and market structures as they form."
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      title: "AI-Powered Insights",
      description: "Our advanced algorithms analyze patterns and market conditions to provide actionable trading insights."
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      title: "Smart Entry/Exit Points",
      description: "Identify optimal entry and exit points with precise support and resistance levels."
    },
    {
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      title: "Multiple Timeframe Analysis",
      description: "Analyze trends across different timeframes to confirm trading signals and improve accuracy."
    },
    {
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
      title: "Real-time Updates",
      description: "Receive instant updates on market movements and changing technical conditions."
    },
    {
      icon: <ChartBar className="h-5 w-5 text-purple-500" />,
      title: "Comprehensive Backtesting",
      description: "Verify trading strategies with historical data to optimize future performance."
    }
  ];
  
  const methodology = [
    {
      icon: <BarChart3 className="h-5 w-5 text-sky-500" />,
      title: "Pattern Recognition",
      description: "Identify classic and complex chart patterns with our advanced recognition algorithms."
    },
    {
      icon: <Cpu className="h-5 w-5 text-violet-500" />,
      title: "Machine Learning Models",
      description: "Trained on millions of historical price movements to predict future market behavior."
    },
    {
      icon: <BarChart4 className="h-5 w-5 text-pink-500" />,
      title: "Technical Indicators",
      description: "Combine momentum, volume, and trend indicators for comprehensive analysis."
    },
    {
      icon: <Sigma className="h-5 w-5 text-amber-600" />,
      title: "Statistical Analysis",
      description: "Apply mathematical models to identify high-probability trading opportunities."
    },
    {
      icon: <ChartPie className="h-5 w-5 text-emerald-600" />,
      title: "Market Sentiment Analysis",
      description: "Incorporate sentiment indicators to gauge market psychology and potential reversals."
    },
    {
      icon: <Presentation className="h-5 w-5 text-blue-600" />,
      title: "Risk Management Protocols",
      description: "Calculate optimal position sizes and stop-loss levels based on market volatility."
    }
  ];
  
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          How We Work
        </CardTitle>
        <CardDescription>
          Our approach combines advanced AI and technical analysis for accurate market insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="approach"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approach">Our Approach</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
          </TabsList>
          <TabsContent value="approach" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center mb-3">
                    {feature.icon}
                    <h3 className="font-medium ml-2">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="methodology" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {methodology.map((method, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center mb-3">
                    {method.icon}
                    <h3 className="font-medium ml-2">{method.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HowWeWork;
