
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommunityForumComponent from "../components/CommunityForum";

const CommunityForumPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 px-4 py-5 rounded-lg glass-panel animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              Community Forum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Join our crypto trading community to share insights, ask questions, and learn from fellow traders. 
              Whether you're an experienced trader or just getting started, our community forum is the perfect place 
              to connect with others who share your passion for cryptocurrency trading and market analysis.
            </p>
            <CommunityForumComponent />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CommunityForumPage;
