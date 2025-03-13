
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  TrendingUp, 
  ArrowDownUp, 
  ArrowDown, 
  Target, 
  BarChart3, 
  TrendingDown,
  ArrowUpRight
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
}

const defaultControls: ChartControlsState = {
  showSupportResistance: true,
  showEntryExitPoints: true,
  showPatterns: true,
  showFibonacciLevels: true,
  showTrendLines: true,
};

const ChartControls = ({ onControlsChange }: ChartControlsProps) => {
  const [controls, setControls] = useState<ChartControlsState>(defaultControls);

  const handleControlChange = (key: keyof ChartControlsState, value: boolean) => {
    const newControls = { ...controls, [key]: value };
    setControls(newControls);
    onControlsChange(newControls);
  };

  return (
    <div className="glass-panel rounded-lg p-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-3">Chart Controls</h3>
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
