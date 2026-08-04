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
import BypassOverlay from './components/BypassOverlay';
import { useState } from 'react';
import UpdateNotifier from './components/UpdateNotifier';

function MainApp() {
  const { currentUser, maintenanceConfig } = useApp();
  const [bypassMaint, setBypassMaint] = useState(false);

  // If maintenance is active, and they aren't logged in as an admin, show Maintenance.
  if (maintenanceConfig?.isActive && !currentUser?.isAdmin) {
    if (currentUser && !currentUser.isAdmin) {
      return <MaintenanceScreen onBypass={() => {}} allowBypass={false} />;
    }
    if (!bypassMaint) {
      return <MaintenanceScreen onBypass={() => setBypassMaint(true)} allowBypass={true} />;
    }
    return (
      <>
        <WarningBanner />
        <UpdateBanner />
        <LoaBanner />
        <LoginScreen />
        <NotificationOverlay />
      </>
    );
  }

  // Check suspension
  if (currentUser?.suspendedUntil && new Date(currentUser.suspendedUntil).getTime() > Date.now()) {
    return <SuspendedScreen />;
  }


  // Staff Portal (Dashboard or Login)
  return (
    <>
      <WarningBanner />
      <UpdateBanner />
      <LoaBanner />
      {currentUser ? <Dashboard /> : <LoginScreen />}
      <NotificationOverlay />
      <BypassOverlay />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
      <UpdateNotifier />
    </AppProvider>
  );
}
