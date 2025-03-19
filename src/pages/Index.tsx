
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { 
  BellRing, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Search, 
  Shield, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6 animate-slide-up">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <Sparkles className="h-4 w-4 mr-1" />
                Never miss a trial deadline again
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
                Take control of your subscriptions with <span className="text-primary">TrialGuard</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Track free trials, get timely reminders, and never pay for unwanted subscriptions again. Your all-in-one subscription management solution.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/signup">
                  <Button size="lg" className="px-8 py-6 rounded-full text-base">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button size="lg" variant="outline" className="px-8 py-6 rounded-full text-base">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* App Preview */}
            <div className="mt-16 max-w-5xl mx-auto glassmorphism p-2 rounded-xl shadow-xl animate-fade-in">
              <div className="bg-slate-900 rounded-lg aspect-video w-full overflow-hidden">
                {/* This would be an app screenshot or demo video */}
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-white mb-3">TrialGuard Dashboard</div>
                    <p className="text-white/70">Your subscription control center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6 md:px-10 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">How TrialGuard Works</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple, effective subscription management in three easy steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background rounded-xl p-6 border border-border shadow-sm hover-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Subscriptions</h3>
                <p className="text-muted-foreground">
                  Add your trials and subscriptions with just a few clicks. We'll keep everything organized in one place.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-background rounded-xl p-6 border border-border shadow-sm hover-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <BellRing className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Reminders</h3>
                <p className="text-muted-foreground">
                  Receive timely email reminders before your free trials end. Never be charged unexpectedly again.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-background rounded-xl p-6 border border-border shadow-sm hover-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Cancellation</h3>
                <p className="text-muted-foreground">
                  Get AI-generated step-by-step cancellation instructions for any service with a single click.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose TrialGuard</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                The smart way to manage free trials and save money
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Benefit 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Global Company Search</h3>
                  <p className="text-muted-foreground">
                    Search and find any service worldwide with our powerful company database integration.
                  </p>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Cancellation</h3>
                  <p className="text-muted-foreground">
                    Get detailed, accurate cancellation steps for any service with our AI technology.
                  </p>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Custom Reminders</h3>
                  <p className="text-muted-foreground">
                    Set personalized reminder schedules for each subscription based on your preferences.
                  </p>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                  <p className="text-muted-foreground">
                    Your subscription data is encrypted and never shared with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 md:px-10 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to take control of your subscriptions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who never miss a trial deadline. Start managing your subscriptions today.
            </p>
            <Link to="/signup">
              <Button size="lg" className="px-8 py-6 rounded-full text-base">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
