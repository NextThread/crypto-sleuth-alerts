
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart2, Database, Users } from "lucide-react";
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const CHART_COUNT_KEY = 'globalChartCount';
const LOCAL_STORAGE_KEY = 'totalAnalysis';
const INITIAL_COUNT = 10000;

const AnalysisCounter = () => {
  const [totalAnalysis, setTotalAnalysis] = useState(INITIAL_COUNT);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Try to load from localStorage first
    const savedCount = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCount) {
      setTotalAnalysis(parseInt(savedCount, 10));
    }

    // Set up real-time listener to Firestore
    const countRef = doc(db, 'stats', CHART_COUNT_KEY);
    
    // First get the initial count
    const fetchInitialCount = async () => {
      try {
        const countDoc = await getDoc(countRef);
        if (countDoc.exists()) {
          const count = countDoc.data().count || INITIAL_COUNT;
          setTotalAnalysis(count);
          localStorage.setItem(LOCAL_STORAGE_KEY, count.toString());
        }
      } catch (error) {
        console.error('Error fetching initial count:', error);
      }
    };
    
    fetchInitialCount();
    
    // Then listen for real-time updates
    const unsubscribe = onSnapshot(countRef, (doc) => {
      if (doc.exists()) {
        const newCount = doc.data().count || INITIAL_COUNT;
        setTotalAnalysis(newCount);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1500);
        localStorage.setItem(LOCAL_STORAGE_KEY, newCount.toString());
      }
    }, (error) => {
      console.error('Error listening to counter updates:', error);
    });

    return () => unsubscribe();
  }, []);

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
              <h3 className={`text-2xl font-mono font-bold ${isAnimating ? 'text-primary animate-pulse' : ''}`}>
                {totalAnalysis.toLocaleString()}
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
                {(totalAnalysis * 215).toLocaleString()}
              </h3>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Active Traders</p>
              <h3 className="text-2xl font-mono font-bold">
                {Math.floor(totalAnalysis / 21).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisCounter;
