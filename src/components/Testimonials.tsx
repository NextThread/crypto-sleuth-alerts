
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  stars: number;
  quote: string;
}

const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Day Trader",
    avatar: "SJ",
    stars: 5,
    quote: "ChartPulse has transformed my trading strategy. The real-time pattern recognition helped me spot opportunities I would have missed otherwise. I've seen a 27% improvement in my monthly returns since using this platform."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Crypto Investor",
    avatar: "MC",
    stars: 5,
    quote: "As someone deeply involved in cryptocurrency markets, I need tools that can keep up with the volatility. ChartPulse's technical analysis has been incredibly accurate, helping me make data-driven decisions rather than emotional ones."
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Financial Analyst",
    avatar: "ER",
    stars: 4,
    quote: "The backtesting capabilities on ChartPulse are outstanding. I can validate strategies across different market conditions before implementing them. This level of risk management is invaluable in today's unpredictable markets."
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Swing Trader",
    avatar: "DT",
    stars: 5,
    quote: "The support and resistance level identification on ChartPulse is the most accurate I've found. It's helped me set better entry and exit points, significantly reducing my losses on volatile trades."
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Institutional Trader",
    avatar: "AP",
    stars: 5,
    quote: "My firm has integrated ChartPulse into our daily analysis workflow. The pattern recognition algorithms have consistently outperformed our previous tools, giving us an edge in identifying emerging market trends."
  }
];

const Testimonials: React.FC = () => {
  return (
    <Card className="glass-card animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            What Traders Say About Us
          </h2>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonialData.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="bg-card/60 border-white/5">
                    <CardContent className="p-6 flex flex-col min-h-[280px]">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3 items-center">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback className="bg-primary/20 text-primary">{testimonial.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(testimonial.stars)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <blockquote className="italic text-muted-foreground flex-grow">
                        "{testimonial.quote}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-4">
            <CarouselPrevious className="relative static transform-none translate-y-0 left-0" />
            <CarouselNext className="relative static transform-none translate-y-0 right-0" />
          </div>
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default Testimonials;
