import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BellRing, Mail, Send, Key } from 'lucide-react';
import { NotificationPreferences } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const defaultPreferences: NotificationPreferences = {
  priceAlerts: true,
  whaleAlerts: true,
  emailNotifications: false,
  telegramNotifications: false
};

const Settings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    () => {
      const saved = localStorage.getItem('notificationPreferences');
      return saved ? JSON.parse(saved) : defaultPreferences;
    }
  );
  const [email, setEmail] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();
  
  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
  };
  
  const handleSaveContact = () => {
    if (preferences.emailNotifications && !email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address for notifications.",
        variant: "destructive",
      });
      return;
    }
    
    if (preferences.telegramNotifications && !telegramId) {
      toast({
        title: "Telegram ID Required",
        description: "Please enter your Telegram ID for notifications.",
        variant: "destructive",
      });
      return;
    }
    
    const newPreferences = { 
      ...preferences, 
      emailAddress: email || undefined, 
      telegramId: telegramId || undefined 
    };
    
    setPreferences(newPreferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
    
    toast({
      title: "Contact Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };
  
  const handleSaveApiKey = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('apiKey', apiKey);
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved for future use.",
    });
  };
  
  const notificationItems = [
    { 
      key: 'priceAlerts' as const, 
      title: 'Price Alerts', 
      description: 'Receive notifications when cryptocurrencies hit your target price.',
      icon: <BellRing size={18} />
    },
    { 
      key: 'whaleAlerts' as const, 
      title: 'Whale Transactions', 
      description: 'Get notified about large cryptocurrency transactions.',
      icon: <Mail size={18} />
    },
    { 
      key: 'emailNotifications' as const, 
      title: 'Email Notifications', 
      description: 'Receive alerts via email.',
      icon: <Mail size={18} />
    },
    { 
      key: 'telegramNotifications' as const, 
      title: 'Telegram Notifications', 
      description: 'Receive alerts via Telegram.',
      icon: <Send size={18} />
    }
  ];
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationItems.map((item) => (
                <div 
                  key={item.key} 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    preferences[item.key] ? "bg-secondary/50" : "bg-secondary/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 rounded-full p-1.5",
                      preferences[item.key] ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted/5"
                    )}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                  <Switch
                    checked={preferences[item.key]}
                    onCheckedChange={() => handleToggle(item.key)}
                    aria-label={`Toggle ${item.title}`}
                  />
                </div>
              ))}
              
              {(preferences.emailNotifications || preferences.telegramNotifications) && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-lg">Contact Information</h3>
                  
                  {preferences.emailNotifications && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        placeholder="your@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-secondary/30 border-white/5"
                      />
                    </div>
                  )}
                  
                  {preferences.telegramNotifications && (
                    <div className="space-y-2">
                      <Label htmlFor="telegram">Telegram ID</Label>
                      <Input
                        id="telegram"
                        placeholder="@yourusername"
                        value={telegramId}
                        onChange={(e) => setTelegramId(e.target.value)}
                        className="bg-secondary/30 border-white/5"
                      />
                    </div>
                  )}
                  
                  <Button onClick={handleSaveContact} className="mt-2">
                    Save Contact Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key size={18} />
                API Integration
              </CardTitle>
              <CardDescription>
                Enter your API key for integration with crypto exchanges.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  placeholder="Enter your API key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-secondary/30 border-white/5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
              
              <Button onClick={handleSaveApiKey}>Save API Key</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;
