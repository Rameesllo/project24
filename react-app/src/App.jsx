import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Views
import LoadingView from './components/views/LoadingView';
import RoleSelectionView from './components/views/RoleSelectionView';
import StudentLoginView from './components/views/StudentLoginView';
import DriverLoginView from './components/views/DriverLoginView';
import AdminLoginView from './components/views/AdminLoginView';
import ForgotPasswordView from './components/views/ForgotPasswordView';
import UpdatePasswordView from './components/views/UpdatePasswordView';
import StudentDashboard from './components/views/StudentDashboard';
import TrackingView from './components/views/TrackingView';
import PaymentView from './components/views/PaymentView';
import ProfileView from './components/views/ProfileView';
import NotificationsView from './components/views/NotificationsView';
import DriverDashboard from './components/views/DriverDashboard';
import AdminDashboard from './components/views/AdminDashboard';

// Layout
import BottomNav from './components/layout/BottomNav';

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedRouteData, setSelectedRouteData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Robust detection of recovery flow from URL
    const url = new URL(window.location.href);
    const hasRecoveryQuery = url.searchParams.get('type') === 'recovery';
    const hasRecoveryHash = window.location.hash.includes('type=recovery');
    const hasAccessToken = window.location.hash.includes('access_token=');
    
    console.log("URL Detection Check:", { hasRecoveryQuery, hasRecoveryHash, hasAccessToken });

    if (hasRecoveryQuery || (hasRecoveryHash && hasAccessToken)) {
      console.log("✅ Detection: Password Recovery flow identified.");
      window.isPasswordRecovery = true;
      setCurrentView('update-password');
    }

    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!window.isPasswordRecovery) {
        handleAuthChange(session);
      }
    });

    // Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      
      if (event === 'PASSWORD_RECOVERY') {
        window.isPasswordRecovery = true;
        setCurrentView('update-password');
      } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (window.isPasswordRecovery) {
          // Stay on update page if we're recovering
          setCurrentView('update-password');
        } else {
          handleAuthChange(session);
        }
      } else if (event === 'SIGNED_OUT') {
        window.isPasswordRecovery = false;
        handleAuthChange(null);
      }
    });

    // Global Notification Listener for Automated Stop Alerts
    const notifChannel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        const newNotif = payload.new;
        const role = localStorage.getItem('nextstop_role');
        const myStop = localStorage.getItem('nextstop_boarding_stop');
        
        // Only show toast if it's a student and relevant to their boarding stop
        if (role === 'student' && myStop) {
          if (newNotif.title.includes('Bus Reached') && newNotif.title.includes(myStop)) {
            showToast(newNotif.title, newNotif.message);
          }
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(notifChannel);
    };
  }, []);

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleAuthChange = (session) => {
    setSession(session);
    if (session) {
      // Prioritize role from user_metadata, fallback to localStorage
      const role = session.user.user_metadata?.role || localStorage.getItem('nextstop_role');

      if (role) {
        localStorage.setItem('nextstop_role', role); // Sync metadata back to storage
        setUserRole(role);

        if (role === 'driver') setCurrentView('driver-dashboard');
        else if (role === 'admin') setCurrentView('admin-dashboard');
        else {
          setCurrentView('student-dashboard');
          // Fetch student boarding stop for notification filtering
          supabase.from('profiles')
            .select('boarding_stop')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data?.boarding_stop) {
                localStorage.setItem('nextstop_boarding_stop', data.boarding_stop);
              }
            });
        }
      } else {
        // Fallback for students without metadata
        setUserRole('student');
        localStorage.setItem('nextstop_role', 'student');
        setCurrentView('student-dashboard');
      }
    } else {
      const persistedRole = localStorage.getItem('nextstop_role');
      if (persistedRole) {
        setUserRole(persistedRole);
        if (persistedRole === 'driver') setCurrentView('driver-dashboard');
        else if (persistedRole === 'admin') setCurrentView('admin-dashboard');
        else setCurrentView('student-dashboard');
      } else {
        setCurrentView('role-selection');
      }
    }
  };

  const navigateTo = (view) => {
    window.scrollTo(0, 0);
    setCurrentView(view);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('nextstop_role');
    setSession(null);
    setUserRole(null);
    setCurrentView('role-selection');
  };

  const renderView = () => {
    switch (currentView) {
      case 'loading': return <LoadingView />;
      case 'role-selection': return <RoleSelectionView onSelectRole={(role) => navigateTo(`${role}-login`)} />;
      case 'student-login': return <StudentLoginView onBack={() => navigateTo('role-selection')} onLoginSuccess={() => navigateTo('student-dashboard')} onForgotPassword={() => navigateTo('forgot-password')} />;
      case 'driver-login': return <DriverLoginView onBack={() => navigateTo('role-selection')} onLoginSuccess={() => navigateTo('driver-dashboard')} />;
      case 'admin-login': return <AdminLoginView onBack={() => navigateTo('role-selection')} onLoginSuccess={() => navigateTo('admin-dashboard')} />;
      case 'forgot-password': return <ForgotPasswordView onBack={() => navigateTo('student-login')} />;
      case 'update-password': return <UpdatePasswordView onComplete={() => navigateTo('student-login')} />;

      // Student Views
      case 'student-dashboard': return <StudentDashboard onNavigate={(view, data) => {
        if (view === 'tracking') setSelectedRouteData(data);
        navigateTo(view);
      }} onShowNotifications={() => navigateTo('notifications')} />;
      case 'tracking': return <TrackingView onBack={() => navigateTo('student-dashboard')} routeData={selectedRouteData} />;
      case 'payment': return <PaymentView />;
      case 'profile': return <ProfileView onSignOut={handleSignOut} />;
      case 'notifications': return <NotificationsView onBack={() => navigateTo('student-dashboard')} currentRouteId={selectedRouteData?.routeId} />;

      // Driver Views
      case 'driver-dashboard': return <DriverDashboard onSignOut={handleSignOut} />;

      // Admin Views
      case 'admin-dashboard': return <AdminDashboard onSignOut={handleSignOut} />;

      default: return <RoleSelectionView onSelectRole={(role) => navigateTo(`${role}-login`)} />;
    }
  };

  const showBottomNav = ['student-dashboard', 'tracking', 'payment', 'profile', 'notifications'].includes(currentView);

  return (
    <div id="app-container">
      <main id="app-content">
        {renderView()}
      </main>
      {showBottomNav && <BottomNav activeView={currentView} onNavigate={navigateTo} />}
      
      {/* Global Toast Notification */}
      {toast && (
        <div className="global-toast animate-slide-up" onClick={() => setToast(null)}>
          <div className="toast-icon">
            <i className="ph-fill ph-bell-ringing"></i>
          </div>
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}
    </div>
  );
}

export default App;
