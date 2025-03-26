
const PostLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse space-y-6">
        {/* Header with improved styling */}
        <div className="space-y-3">
          <div className="h-5 w-28 bg-muted rounded"></div>
          <div className="h-12 w-4/5 bg-muted rounded"></div>
          <div className="flex space-x-2 items-center">
            <div className="h-8 w-8 bg-muted rounded-full"></div>
            <div className="h-5 w-24 bg-muted rounded"></div>
            <div className="h-5 w-5 bg-muted rounded-full"></div>
            <div className="h-5 w-32 bg-muted rounded"></div>
          </div>
        </div>
        
        {/* Featured image with shimmer effect */}
        <div className="h-72 md:h-96 bg-gradient-to-r from-muted to-muted/70 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-muted/20 to-transparent shimmer-effect"></div>
        </div>
        
        {/* Content blocks with varied widths */}
        <div className="space-y-4 pt-4">
          <div className="h-5 bg-muted rounded w-full"></div>
          <div className="h-5 bg-muted rounded w-11/12"></div>
          <div className="h-5 bg-muted rounded w-full"></div>
          <div className="h-5 bg-muted rounded w-10/12"></div>
          <div className="h-5 bg-muted rounded w-9/12"></div>
        </div>
        
        {/* Section heading */}
        <div className="h-7 bg-muted rounded w-1/3 mt-8"></div>
        
        {/* More content */}
        <div className="space-y-4">
          <div className="h-5 bg-muted rounded w-full"></div>
          <div className="h-5 bg-muted rounded w-11/12"></div>
          <div className="h-5 bg-muted rounded w-full"></div>
          <div className="h-5 bg-muted rounded w-9/12"></div>
          <div className="h-5 bg-muted rounded w-10/12"></div>
        </div>
        
        {/* Another section heading */}
        <div className="h-7 bg-muted rounded w-1/4 mt-8"></div>
        
        {/* Final content block */}
        <div className="space-y-4">
          <div className="h-5 bg-muted rounded w-full"></div>
          <div className="h-5 bg-muted rounded w-11/12"></div>
          <div className="h-5 bg-muted rounded w-full"></div>
        </div>
        
        {/* Tags section */}
        <div className="flex flex-wrap gap-2 py-6">
          <div className="h-8 w-20 bg-muted rounded-full"></div>
          <div className="h-8 w-24 bg-muted rounded-full"></div>
          <div className="h-8 w-16 bg-muted rounded-full"></div>
          <div className="h-8 w-28 bg-muted rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PostLoading;
