
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

// Function to ensure a valid image URL is used
export const ensureValidImage = (imageUrl: string | undefined, fallbackIndex: number): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    // Generate a predictable but different fallback image based on the index
    const fallbackImages = [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1623141624201-89db01348209?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1556&q=80',
      'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1402&q=80',
      'https://images.unsplash.com/photo-1526374870839-e155464bb9b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1621501103258-d0984c86ea55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80'
    ];
    
    const safeIndex = fallbackIndex % fallbackImages.length;
    return fallbackImages[safeIndex];
  }
  
  return imageUrl.trim();
};

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
