
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md w-full p-8 animate-fade-up">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">The page you're looking for doesn't exist</p>
        <a 
          href="/" 
          className="btn-primary inline-block transition-all duration-300 hover:scale-105"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
