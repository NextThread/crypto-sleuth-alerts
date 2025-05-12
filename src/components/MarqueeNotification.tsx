
import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface MarqueeNotificationProps {
  message: string;
  speed?: 'slow' | 'normal' | 'fast';
}

const MarqueeNotification = ({ message, speed = 'normal' }: MarqueeNotificationProps) => {
  const speedClass = {
    slow: 'animate-marquee-slow',
    normal: 'animate-marquee',
    fast: 'animate-marquee-fast'
  }[speed];

  return (
    <div className="bg-primary/10 backdrop-blur-sm border-b border-primary/20 py-1.5 overflow-hidden whitespace-nowrap relative">
      <div className={`flex items-center inline-block ${speedClass}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center mx-4 gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-sm">
              {message}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-primary ml-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeNotification;
