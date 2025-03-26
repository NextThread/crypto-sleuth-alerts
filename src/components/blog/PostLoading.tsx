
const PostLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/4 bg-muted rounded"></div>
        <div className="h-10 w-3/4 bg-muted rounded"></div>
        <div className="h-6 w-2/4 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 w-5/6 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PostLoading;
