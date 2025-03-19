
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TrialGuard
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
          >
            <Github className="h-4 w-4 mr-1" />
            GitHub
          </a>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="flex items-center">
            Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> by Lovable
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
