
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  ArrowDownUp, 
  ArrowDown, 
  Target, 
  BarChart3, 
  TrendingDown,
  ArrowUpRight,
  LineChart,
  CandlestickChart,
  ChevronRight,
  ChevronDown,
  Triangle,
  Check,
  Lock
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ChartControlsProps {
  onControlsChange: (controls: ChartControlsState) => void;
}

export interface PatternControlsState {
  showHeadAndShoulders: boolean;
  showDoubleTop: boolean;
  showDoubleBottom: boolean;
  showTriangle: boolean;
  showWedge: boolean;
}

export interface ChartControlsState {
  showSupportResistance: boolean;
  showEntryExitPoints: boolean;
  showPatterns: boolean;
  showFibonacciLevels: boolean;
  showTrendLines: boolean;
  chartType: 'line' | 'candlestick';
  patternControls?: PatternControlsState;
}

// Default controls that will be used if no localStorage data is found
const defaultControls: ChartControlsState = {
  showSupportResistance: true,
  showEntryExitPoints: true,
  showPatterns: true,
  showFibonacciLevels: true,
  showTrendLines: true,
  chartType: 'line',
  patternControls: {
    showHeadAndShoulders: true,
    showDoubleTop: true,
    showDoubleBottom: true,
    showTriangle: true,
    showWedge: true
  }
};

const ChartControls = ({ onControlsChange }: ChartControlsProps) => {
  const { currentSubscription } = useSubscription();
  const isPremiumUser = currentSubscription.planId !== null;
  const navigate = useNavigate();

  // Initialize controls from localStorage or use defaults
  const [controls, setControls] = useState<ChartControlsState>(() => {
    try {
      const savedControls = localStorage.getItem('chartControls');
      return savedControls ? { 
        ...defaultControls, 
        ...JSON.parse(savedControls),
        patternControls: { 
          ...defaultControls.patternControls, 
          ...(JSON.parse(savedControls).patternControls || {}) 
        }
      } : defaultControls;
    } catch (error) {
      console.error('Error parsing localStorage chart controls', error);
      return defaultControls;
    }
  });

  const [patternDropdownOpen, setPatternDropdownOpen] = useState(false);

  // Handle control changes and save to localStorage
  const handleControlChange = (key: keyof ChartControlsState, value: any) => {
    // If trying to set candlestick chart but not premium, show upgrade prompt
    if (key === 'chartType' && value === 'candlestick' && !isPremiumUser) {
      return;
    }
    
    const newControls = { ...controls, [key]: value };
    setControls(newControls);
    localStorage.setItem('chartControls', JSON.stringify(newControls));
    onControlsChange(newControls);
  };

  // Handle pattern control changes
  const handlePatternControlChange = (key: keyof PatternControlsState, value: boolean) => {
    const newPatternControls = { ...(controls.patternControls || defaultControls.patternControls), [key]: value };
    const newControls = { ...controls, patternControls: newPatternControls };
    setControls(newControls);
    localStorage.setItem('chartControls', JSON.stringify(newControls));
    onControlsChange(newControls);
  };

  // Call onControlsChange with initial values on mount
  useEffect(() => {
    onControlsChange(controls);
  }, []);

  const handleUpgradeClick = () => {
    navigate('/subscription');
  };

  return (
    <div className="glass-panel rounded-lg p-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-3">Chart Controls</h3>
      
      {/* Chart Type Toggle */}
      <div className="mb-4 pb-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium mb-2">Chart Type</Label>
        </div>
        <div className="flex gap-2 mt-1">
          <ToggleGroup type="single" value={controls.chartType} onValueChange={(value) => {
            if (value) handleControlChange('chartType', value);
          }}>
            <ToggleGroupItem value="line" className="flex items-center gap-1 data-[state=on]:bg-primary/20 data-[state=on]:text-primary">
              <LineChart className="h-4 w-4" />
              <span>Line</span>
            </ToggleGroupItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ToggleGroupItem 
                      value="candlestick" 
                      className={`flex items-center gap-1 data-[state=on]:bg-primary/20 data-[state=on]:text-primary ${!isPremiumUser ? 'opacity-60' : ''}`}
                      disabled={!isPremiumUser}
                      onClick={(e) => {
                        if (!isPremiumUser) {
                          e.preventDefault();
                          handleUpgradeClick();
                        }
                      }}
                    >
                      <CandlestickChart className="h-4 w-4" />
                      <span>Candlestick</span>
                      {!isPremiumUser && <Lock className="h-3 w-3 ml-1" />}
                    </ToggleGroupItem>
                  </div>
                </TooltipTrigger>
                {!isPremiumUser && (
                  <TooltipContent>
                    <p className="text-xs">Premium feature - Subscribe to unlock</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </ToggleGroup>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Support & Resistance</span>
          </div>
          <Switch 
            checked={controls.showSupportResistance}
            onCheckedChange={(checked) => handleControlChange('showSupportResistance', checked)} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Entry/Exit Points</span>
          </div>
          <Switch 
            checked={controls.showEntryExitPoints}
            onCheckedChange={(checked) => handleControlChange('showEntryExitPoints', checked)}
          />
        </div>
        
        {/* Pattern Detection with dropdown for detailed controls */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPatternDropdownOpen(!patternDropdownOpen)}>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Pattern Detection</span>
              {patternDropdownOpen ? 
                <ChevronDown className="h-3 w-3 text-muted-foreground" /> : 
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              }
            </div>
            <Switch 
              checked={controls.showPatterns}
              onCheckedChange={(checked) => handleControlChange('showPatterns', checked)}
            />
          </div>
          
          {/* Pattern type specific controls */}
          {patternDropdownOpen && controls.showPatterns && (
            <div className="ml-6 space-y-2 mt-2 mb-3 p-2 bg-black/10 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3">
                    <div className="w-full h-full rounded-full bg-pink-400"></div>
                  </div>
                  <span className="text-xs">Head & Shoulders</span>
                </div>
                <Switch 
                  checked={controls.patternControls?.showHeadAndShoulders}
                  onCheckedChange={(checked) => handlePatternControlChange('showHeadAndShoulders', checked)}
                  className="h-3 w-6"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3">
                    <div className="w-full h-full rounded-full bg-orange-400"></div>
                  </div>
                  <span className="text-xs">Double Top</span>
                </div>
                <Switch 
                  checked={controls.patternControls?.showDoubleTop}
                  onCheckedChange={(checked) => handlePatternControlChange('showDoubleTop', checked)}
                  className="h-3 w-6"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3">
                    <div className="w-full h-full rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs">Double Bottom</span>
                </div>
                <Switch 
                  checked={controls.patternControls?.showDoubleBottom}
                  onCheckedChange={(checked) => handlePatternControlChange('showDoubleBottom', checked)}
                  className="h-3 w-6"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3">
                    <div className="w-full h-full rounded-full bg-blue-400"></div>
                  </div>
                  <span className="text-xs">Triangles</span>
                </div>
                <Switch 
                  checked={controls.patternControls?.showTriangle}
                  onCheckedChange={(checked) => handlePatternControlChange('showTriangle', checked)}
                  className="h-3 w-6"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3">
                    <div className="w-full h-full rounded-full bg-red-400"></div>
                  </div>
                  <span className="text-xs">Wedges</span>
                </div>
                <Switch 
                  checked={controls.patternControls?.showWedge}
                  onCheckedChange={(checked) => handlePatternControlChange('showWedge', checked)}
                  className="h-3 w-6"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Fibonacci Levels</span>
          </div>
          <Switch 
            checked={controls.showFibonacciLevels}
            onCheckedChange={(checked) => handleControlChange('showFibonacciLevels', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Trend Lines</span>
          </div>
          <Switch 
            checked={controls.showTrendLines}
            onCheckedChange={(checked) => handleControlChange('showTrendLines', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartControls;
