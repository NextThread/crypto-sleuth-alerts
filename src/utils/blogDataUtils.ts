
import { useState, useEffect } from 'react';
import { blogPosts } from '../data/blogPosts';

export interface BlogPost {
  slug: string;
  title?: string;
  description?: string;
  content?: string;
  date?: string | Date;
  author?: string;
  image?: string;
  category?: string;
  tags?: string[];
  readingTime?: string;
}

// Add formatDate function export
export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'No date available';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  // Format the date as "Month DD, YYYY"
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Hook to safely get blog data
export const useSafeBlogData = () => {
  const [state, setState] = useState<{
    allPosts: BlogPost[];
    isLoaded: boolean;
    hasError: boolean;
  }>({
    allPosts: [],
    isLoaded: false,
    hasError: false
  });

  useEffect(() => {
    try {
      // Set the blog posts after a short timeout to simulate loading
      const timer = setTimeout(() => {
        setState({
          allPosts: blogPosts,
          isLoaded: true,
          hasError: false
        });
      }, 500);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setState({
        allPosts: [],
        isLoaded: true,
        hasError: true
      });
    }
  }, []);

  return state;
};
