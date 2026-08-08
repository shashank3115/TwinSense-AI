import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect to dashboard
    navigate("/overview");
  }, [navigate]);

  return null;
}
