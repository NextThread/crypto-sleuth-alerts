
const PostLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="h-5 w-20 bg-muted rounded"></div>
          <div className="h-10 w-3/4 bg-muted rounded"></div>
          <div className="flex space-x-2">
            <div className="h-5 w-24 bg-muted rounded"></div>
            <div className="h-5 w-5 bg-muted rounded-full"></div>
            <div className="h-5 w-32 bg-muted rounded"></div>
          </div>
        </div>
        
        {/* Featured image */}
        <div className="h-72 md:h-96 bg-muted rounded-lg"></div>
        
        {/* Content blocks */}
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
        </div>
        
        {/* Tags section */}
        <div className="flex space-x-2 py-6">
          <div className="h-8 w-20 bg-muted rounded-full"></div>
          <div className="h-8 w-24 bg-muted rounded-full"></div>
          <div className="h-8 w-16 bg-muted rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PostLoading;
