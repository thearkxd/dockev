import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="transition-all duration-300 ease-out"
      style={{
        animation: "fadeInSlide 0.3s ease-out",
      }}
    >
      {children}
    </div>
  );
}
