import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlaneTakeoff, Plane, FileX, CalendarClock, Tag, ArrowRight,
  ShieldCheck, Award, Headphones, Briefcase, User, Globe, Mail, Phone, Heart
} from 'lucide-react';
import './LandingPage.css'; // We will add specific styles for the landing page

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-layout">
      {/* Top Navigation */}
      <header className="landing-nav">
        <div className="logo-section">
          <PlaneTakeoff size={32} className="logo-icon" />
          <span>FlyBie</span>
        </div>
        <div className="nav-links">
          <span className="nav-link active">Home</span>
          <span className="nav-link">Manage Booking</span>
          <span className="nav-link">Offers</span>
          <span className="nav-link">Help</span>
          <span className="nav-link">Contact Us</span>
        </div>
        <div className="user-avatar-outline">
          <User size={20} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Fly better.<br/><span className="script-text">Every time.</span></h1>
          <p>Seamless bookings, flexible changes and unforgettable journeys – all with FlyBie.</p>
        </div>
        {/* We use a placeholder image resembling the airplane over clouds */}
        <div className="hero-image-overlay"></div>
      </section>

      {/* Action Cards */}
      <section className="action-cards-section">
        {/* Booking Card - Navigates to Chatbot */}
        <div className="action-card booking-card" onClick={() => navigate('/chat')}>
          <div className="card-icon blue-icon">
            <Plane size={32} />
          </div>
          <h3>Booking</h3>
          <p>Book your flight to your favorite destinations.</p>
          <button className="card-action-btn blue-btn">
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="action-card">
          <div className="card-icon red-icon">
            <FileX size={32} />
          </div>
          <h3>Cancellation</h3>
          <p>Cancel your flight quickly and hassle-free.</p>
          <button className="card-action-btn red-btn">
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="action-card">
          <div className="card-icon green-icon">
            <CalendarClock size={32} />
          </div>
          <h3>Rescheduling</h3>
          <p>Change your travel dates with ease.</p>
          <button className="card-action-btn green-btn">
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Explore Banner */}
      <section className="explore-banner-container">
        <div className="explore-banner">
          <div className="explore-content">
            <div className="explore-icon">
              <Tag size={24} color="#1d4ed8" />
            </div>
            <div>
              <h3>Explore the world with FlyBie</h3>
              <p>Exclusive deals on domestic and international flights.</p>
            </div>
          </div>
          <button className="explore-btn">
            Explore Offers <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Features List */}
      <section className="features-section">
        <div className="feature-item">
          <div className="feature-icon"><ShieldCheck size={28} /></div>
          <div>
            <h4>Safe & Secure</h4>
            <p>Your safety is our top priority.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><Award size={28} /></div>
          <div>
            <h4>Best Fares</h4>
            <p>Get the best deals on every booking.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><Headphones size={28} /></div>
          <div>
            <h4>24/7 Support</h4>
            <p>We're here for you, always.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><Briefcase size={28} /></div>
          <div>
            <h4>Seamless Travel</h4>
            <p>Enjoy a smooth journey from start to finish.</p>
          </div>
        </div>
      </section>

      {/* Footer Signature */}
      <div className="signature-section">
        <span className="script-text signature-text">Your journey. Our priority.</span>
        <Heart size={24} color="#1d4ed8" strokeWidth={1.5} />
      </div>

      {/* Main Footer */}
      <footer className="main-footer">
        <div className="footer-logo">
          <PlaneTakeoff size={24} className="logo-icon white-icon" />
          <span>FlyBie</span>
        </div>
        <div className="footer-links">
          <span>About Us</span>
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
        </div>
        <div className="footer-socials">
          <Globe size={20} />
          <Mail size={20} />
          <Phone size={20} />
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
