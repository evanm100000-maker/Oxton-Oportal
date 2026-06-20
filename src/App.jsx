import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import WarningBanner from './components/WarningBanner';
import UpdateBanner from './components/UpdateBanner';
import MaintenanceScreen from './components/MaintenanceScreen';
import SuspendedScreen from './components/SuspendedScreen';
import NotificationOverlay from './components/NotificationOverlay';
import LoaBanner from './components/LoaBanner';
import { useState } from 'react';

function MainApp() {
  const { currentUser, maintenanceConfig } = useApp();
  const [bypassMaint, setBypassMaint] = useState(false);

  // If maintenance is active, and they aren't logged in as an admin, show Maintenance.
  // We hide it ONLY if they click the bypass button AND they are not currently logged in as a non-admin.
  // Wait, if they are logged in as non-admin, they should never bypass.
  if (maintenanceConfig?.isActive && !currentUser?.isAdmin) {
    if (currentUser && !currentUser.isAdmin) {
      // Logged in as non-admin, strictly enforce maintenance screen
      return <MaintenanceScreen onBypass={() => {}} allowBypass={false} />;
    }
    if (!bypassMaint) {
      // Not logged in, show maintenance screen but allow bypass to try logging in
      return <MaintenanceScreen onBypass={() => setBypassMaint(true)} allowBypass={true} />;
    }
  }

  // Check suspension
  if (currentUser?.suspendedUntil && new Date(currentUser.suspendedUntil).getTime() > Date.now()) {
    return <SuspendedScreen />;
  }

  return (
    <>
      <WarningBanner />
      <UpdateBanner />
      <LoaBanner />
      {currentUser ? <Dashboard /> : <LoginScreen />}
      <NotificationOverlay />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
