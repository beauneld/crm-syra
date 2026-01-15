import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Calendrier from './components/Calendrier';
import Utilisateurs from './components/Utilisateurs';
import Listes from './components/Listes';
import DevoirConseil from './components/DevoirConseil';
import Partenaires from './components/Partenaires';
import MiseEnRelation from './components/MiseEnRelation';
import SimulationPER from './components/SimulationPER';
import Performance from './components/Performance';
import Parametres from './components/Parametres';
import Client from './components/Client';
import BibliothequeContrats from './components/BibliothequeContrats';
import BibliothequeBienviyance from './components/BibliothequeBienviyance';
import SuiviCommissions from './components/CommissionsSubmenus/SuiviCommissions';
import ParametragesFournisseurs from './components/CommissionsSubmenus/ParametragesFournisseurs';
import RelevesBancairesTab from './components/CommissionsSubmenus/RelevesBancaires';
import StatistiquesCommissions from './components/CommissionsSubmenus/StatistiquesCommissions';
import BordereauxFournisseurs from './components/CommissionsSubmenus/BordereauxFournisseurs';
import NotificationsSidebar from './components/NotificationsSidebar';
import Login from './components/Login';
import { supabase } from './lib/supabase';
import { getActiveProfile } from './services/profileService';
import { UserProfile } from './types';
import { startSession, endSession, updateHeartbeat } from './services/activityTrackingService';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPendingInClient, setShowPendingInClient] = useState(false);
  const [leadsFilter, setLeadsFilter] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        }
        await loadActiveProfile();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadActiveProfile = async () => {
    try {
      const profile = await getActiveProfile();
      setCurrentProfile(profile);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    if (currentProfile && isAuthenticated) {
      const initializeSession = async () => {
        await startSession(currentProfile.id);
      };
      initializeSession();

      const heartbeatInterval = setInterval(() => {
        const sessionId = localStorage.getItem('current_session_id');
        if (sessionId) {
          updateHeartbeat(sessionId);
        }
      }, 30000);

      const handleBeforeUnload = () => {
        const sessionId = localStorage.getItem('current_session_id');
        if (sessionId) {
          endSession(sessionId);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        clearInterval(heartbeatInterval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentProfile, isAuthenticated]);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('current_session_id');
    if (sessionId) {
      await endSession(sessionId);
    }
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const renderPage = () => {
    const pageProps = {
      onNotificationClick: () => setShowNotifications(!showNotifications),
      notificationCount: 1
    };

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...pageProps} onNavigateToClients={(showPending) => {
          setShowPendingInClient(showPending);
          setCurrentPage('client');
        }} onNavigateToLeads={(filter) => {
          setLeadsFilter(filter);
          setCurrentPage('leads');
        }} />;
      case 'leads':
        return <Leads {...pageProps} initialFilter={leadsFilter} userRole={currentProfile?.profile_type || 'Conseiller'} />;
      case 'calendrier':
        return <Calendrier {...pageProps} />;
      case 'client':
        return <Client {...pageProps} initialShowPending={showPendingInClient} />;
      case 'utilisateurs':
        return <Utilisateurs {...pageProps} />;
      case 'listes':
        return <Listes {...pageProps} />;
      case 'devoir-conseil':
        return <DevoirConseil {...pageProps} />;
      case 'partenaires':
        return <Partenaires {...pageProps} />;
      case 'mise-en-relation':
        return <MiseEnRelation {...pageProps} />;
      case 'simulation-per':
        return <SimulationPER {...pageProps} />;
      case 'performance':
        return <Performance {...pageProps} />;
      case 'parametres':
        return <Parametres {...pageProps} />;
      case 'commissions-suivi':
        return <SuiviCommissions />;
      case 'commissions-fournisseurs':
        return <ParametragesFournisseurs />;
      case 'commissions-releves':
        return <RelevesBancairesTab />;
      case 'commissions-statistiques':
        return <StatistiquesCommissions />;
      case 'commissions-bordereaux':
        return <BordereauxFournisseurs />;
      case 'bibliotheque-contrats':
        return <BibliothequeContrats {...pageProps} />;
      case 'bibliotheque-bienviyance':
        return <BibliothequeBienviyance {...pageProps} />;
      default:
        return <Dashboard {...pageProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={async () => {
      setIsAuthenticated(true);
      await loadActiveProfile();
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setIsTransitioning(true);
          setCurrentPage(page);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 150);
        }}
        onCollapseChange={setIsSidebarCollapsed}
        onLogout={handleLogout}
        onProfileChange={setCurrentProfile}
      />
      <div id="contentRight" className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {renderPage()}
        </div>
      </div>
      <NotificationsSidebar isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
}

export default App;
