/**
 * Arena Loading - Neural Sync Sequence
 * Immersive data streaming loading experience with diagnostics
 * Redirects to role-based dashboard after loading completes
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NeuralSyncLoader from "@/components/loading/NeuralSyncLoader";
import { useAuth } from "@/contexts/AuthContext";

const ArenaLoading = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [targetRoute, setTargetRoute] = useState('/agent');

  // Determine target route based on user role
  useEffect(() => {
    // First check localStorage for targetRole (set during login)
    const storedRole = localStorage.getItem('targetRole');
    const role = storedRole || user?.role || 'agent';
    
    const roleRoutes = {
      agent: '/agent',
      manager: '/manager',
      leadership: '/leadership',
      admin: '/admin'
    };
    
    setTargetRoute(roleRoutes[role] || '/agent');
    
    // Clean up the stored role
    if (storedRole) {
      localStorage.removeItem('targetRole');
    }
  }, [user]);

  const handleComplete = () => {
    navigate(targetRoute);
  };

  // Render loader as a full-screen overlay that bypasses layout transitions
  return (
    <NeuralSyncLoader 
      onComplete={handleComplete}
      duration={4500}
      showDiagnostics={true}
      showTips={true}
    />
  );
};

export default ArenaLoading;