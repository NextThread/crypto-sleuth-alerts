
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
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
  CandlestickChart
} from 'lucide-react';

export interface ChartControlsProps {
  onControlsChange: (controls: ChartControlsState) => void;
}

export interface ChartControlsState {
  showSupportResistance: boolean;
  showEntryExitPoints: boolean;
  showPatterns: boolean;
  showFibonacciLevels: boolean;
  showTrendLines: boolean;
  chartType: 'line' | 'candlestick';
}

// Default controls that will be used if no localStorage data is found
const defaultControls: ChartControlsState = {
  showSupportResistance: true,
  showEntryExitPoints: true,
  showPatterns: true,
  showFibonacciLevels: true,
  showTrendLines: true,
  chartType: 'line',
};

const ChartControls = ({ onControlsChange }: ChartControlsProps) => {
  // Initialize controls from localStorage or use defaults
  const [controls, setControls] = useState<ChartControlsState>(() => {
    const savedControls = localStorage.getItem('chartControls');
    return savedControls ? JSON.parse(savedControls) : defaultControls;
  });

  // Handle control changes and save to localStorage
  const handleControlChange = (key: keyof ChartControlsState, value: any) => {
    const newControls = { ...controls, [key]: value };
    setControls(newControls);
    localStorage.setItem('chartControls', JSON.stringify(newControls));
    onControlsChange(newControls);
  };

  // Call onControlsChange with initial values on mount
  useEffect(() => {
    onControlsChange(controls);
  }, []);

  return (
    <div className="glass-panel rounded-lg p-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-3">Chart Controls</h3>
      
      {/* Chart Type Toggle */}
      <div className="mb-4 pb-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium mb-2">Chart Type</Label>
        </div>
        <div className="flex gap-2 mt-1">
          <Toggle
            variant="outline"
            size="sm"
            pressed={controls.chartType === 'line'}
            onPressedChange={() => handleControlChange('chartType', 'line')}
            className="flex items-center gap-1 data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
          >
            <LineChart className="h-4 w-4" />
            <span>Line</span>
          </Toggle>
          <Toggle
            variant="outline"
            size="sm"
            pressed={controls.chartType === 'candlestick'}
            onPressedChange={() => handleControlChange('chartType', 'candlestick')}
            className="flex items-center gap-1 data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
          >
            <CandlestickChart className="h-4 w-4" />
            <span>Candlestick</span>
          </Toggle>
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Pattern Detection</span>
          </div>
          <Switch 
            checked={controls.showPatterns}
            onCheckedChange={(checked) => handleControlChange('showPatterns', checked)}
          />
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
