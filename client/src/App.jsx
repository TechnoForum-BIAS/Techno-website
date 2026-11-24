import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import InventoryPage from './pages/InventoryPage';
import CertificateStudioPage from './pages/CertificateStudioPage';
import CertificateVerifyPage from './pages/CertificateVerifyPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/certificates/studio" element={<CertificateStudioPage />} />
          <Route path="/certificates/verify" element={<CertificateVerifyPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
