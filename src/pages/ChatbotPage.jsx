import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Ticket, XCircle, CalendarClock, PlaneTakeoff, 
  UserCheck, Briefcase, Tag, HelpCircle, User, Bot, Trash2,
  Paperclip, Send, MapPin, Calendar, Users, ArrowRightLeft, Check, Search
} from 'lucide-react';
import { parseEntities, detectAndRedactPII, getAirportCode } from '../bookingEngine';
import { callAzureOpenAI } from '../lib/azureAi';
import { searchTravelportFlights } from '../lib/travelport';

function ChatbotPage() {
  const navigate = useNavigate();
  
  const initialGreeting = "Hi there! 👋\nWelcome to FlyBie. I'm here to help you book your flight.\nJust tell me where you'd like to fly today!";

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [slots, setSlots] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengerCount: 1,
    cabinClass: 'Economy'
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, slots]);

  const executeFlightSearch = async (currentSlots) => {
    setIsTyping(true);
    const oCode = getAirportCode(currentSlots.origin) || currentSlots.origin;
    const dCode = getAirportCode(currentSlots.destination) || currentSlots.destination;
    
    const result = await searchTravelportFlights(oCode, dCode, currentSlots.departureDate);
    setIsTyping(false);
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (result.error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'assistant',
        text: `I'm sorry, I couldn't fetch flights right now. Travelport returned an error: ${result.text}`,
        timestamp: timeStr
      }]);
      return;
    }

    if (!result.flights || result.flights.length === 0) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'assistant',
        text: `I searched Travelport, but couldn't find any flights from ${oCode} to ${dCode} on ${currentSlots.departureDate}.`,
        timestamp: timeStr
      }]);
      return;
    }

    // Add success message and then the flight cards
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'assistant',
        text: `✅ I found ${result.flights.length} flights matching your criteria via Travelport! Here are the best options:`,
        timestamp: timeStr
      },
      {
        id: Date.now() + 1,
        sender: 'assistant',
        type: 'flights',
        flights: result.flights,
        timestamp: timeStr
      }
    ]);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    const { redactedText } = detectAndRedactPII(currentInput);
    
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: redactedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const nextSlots = parseEntities(currentInput, slots);
    setSlots(nextSlots);

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    const historyForAi = updatedMessages
      .filter(m => !m.type) 
      .map(m => ({
        role: m.sender,
        content: m.text
      }));

    const aiResponse = await callAzureOpenAI(historyForAi);
    
    setIsTyping(false);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (aiResponse.error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'assistant',
        text: aiResponse.text,
        timestamp: timeStr
      }]);
      return;
    }

    let responseText = aiResponse.text;

    if (responseText.includes('[TRIGGER_SEARCH]')) {
      responseText = responseText.replace('[TRIGGER_SEARCH]', '').trim();
      
      setMessages(prev => {
        const hasWidget = prev.some(m => m.type === 'widget');
        const newMsgs = [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: responseText || "Perfect! I have all your details. Searching the live database now... 🔍",
            timestamp: timeStr,
            isSearching: true
          }
        ];
        if (!hasWidget) {
          newMsgs.push({ id: Date.now() + 2, sender: 'assistant', type: 'widget', timestamp: timeStr });
        }
        return newMsgs;
      });
      
      // Execute live search
      executeFlightSearch(nextSlots);

    } else {
      setMessages(prev => {
        const hasWidget = prev.some(m => m.type === 'widget');
        const newMsgs = [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: responseText,
            timestamp: timeStr
          }
        ];
        if (!hasWidget) {
          newMsgs.push({ id: Date.now() + 2, sender: 'assistant', type: 'widget', timestamp: timeStr });
        }
        return newMsgs;
      });
    }
  };

  const handleWidgetSearch = () => {
    if (!slots.origin || !slots.destination || !slots.departureDate) {
      alert("Please fill in Origin, Destination, and Departure Date before searching.");
      return;
    }
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: "Please search flights with the details I provided in the form.",
        timestamp: timeStr
      },
      {
        id: Date.now() + 1,
        sender: 'assistant',
        text: `Got it! Connecting to Travelport for live flights from ${getAirportCode(slots.origin) || slots.origin} to ${getAirportCode(slots.destination) || slots.destination}... 🔍`,
        timestamp: timeStr,
        isSearching: true
      }
    ]);

    executeFlightSearch(slots);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setSlots({
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      passengerCount: 1,
      cabinClass: 'Economy'
    });
  };

  const sidebarItems = [
    { icon: Ticket, label: 'Booking', active: true },
    { icon: XCircle, label: 'Cancellation' },
    { icon: CalendarClock, label: 'Rescheduling' },
    { icon: PlaneTakeoff, label: 'Flight Status' },
    { icon: UserCheck, label: 'Check-in' },
    { icon: Briefcase, label: 'My Trips' },
    { icon: Tag, label: 'Offers' },
    { icon: HelpCircle, label: 'Help Center' }
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-back" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item, idx) => (
            <div key={idx} className={`nav-item \${item.active ? 'active' : ''}`}>
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-promo">
          <h3>Fly Better.<br/>Every Time.</h3>
          <p>Book with confidence and experience the best travel with FlyBie.</p>
          <button className="promo-btn">
            Explore Offers →
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-area">
        {/* Top Navigation */}
        <header className="top-nav">
          <div className="logo-section">
            <PlaneTakeoff size={28} className="logo-icon" />
            <span>FlyBie</span>
          </div>
          <div className="top-links">
            <span className="top-link active" onClick={() => navigate('/')}>Home</span>
            <span className="top-link">Manage Booking</span>
            <span className="top-link">Offers</span>
            <span className="top-link">Support</span>
            <div className="user-avatar">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <section className="chat-workspace">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="assistant-info">
              <div className="bot-avatar-large">
                <Bot size={32} />
                <div className="status-dot"></div>
              </div>
              <div className="assistant-text">
                <h2>FlyBie Assistant</h2>
                <p>Your personal travel booking assistant</p>
              </div>
            </div>
            <button className="clear-chat-btn" onClick={handleClearChat}>
              <Trash2 size={16} />
              Clear Chat
            </button>
          </div>

          {/* Messages Feed */}
          <div className="chat-feed">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row \${msg.sender}`}>
                <div className="message-bubble-wrapper">
                  {msg.sender === 'assistant' && msg.type !== 'flights' && (
                    <div className="bot-avatar-small">
                      <Bot size={20} />
                    </div>
                  )}
                  
                  {msg.type === 'widget' ? (
                    <div className="embedded-widget">
                      <div className="widget-title">
                        Let's get started with your booking ✈️
                      </div>
                      
                      <div className="form-group">
                        <label>From</label>
                        <div className="input-with-icon" style={{ position: 'relative' }}>
                          <MapPin size={18} className="input-icon" />
                          <input 
                            type="text" 
                            className="form-input" 
                            value={slots.origin} 
                            onChange={(e) => setSlots({...slots, origin: e.target.value})}
                            placeholder="e.g. New York" 
                          />
                          {getAirportCode(slots.origin) && (
                            <div style={{ position: 'absolute', right: '40px', background: '#e0e7ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                              {getAirportCode(slots.origin)}
                            </div>
                          )}
                          <ArrowRightLeft size={16} style={{ position: 'absolute', right: '14px', color: '#1d4ed8' }} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>To</label>
                        <div className="input-with-icon" style={{ position: 'relative' }}>
                          <MapPin size={18} className="input-icon" />
                          <input 
                            type="text" 
                            className="form-input" 
                            value={slots.destination} 
                            onChange={(e) => setSlots({...slots, destination: e.target.value})}
                            placeholder="e.g. London" 
                          />
                          {getAirportCode(slots.destination) && (
                            <div style={{ position: 'absolute', right: '14px', background: '#e0e7ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                              {getAirportCode(slots.destination)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Departure Date</label>
                          <div className="input-with-icon">
                            <input 
                              type="date" 
                              className="form-input" 
                              style={{ paddingLeft: '14px' }}
                              value={slots.departureDate || ''} 
                              onChange={(e) => setSlots({...slots, departureDate: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Return Date (Optional)</label>
                          <div className="input-with-icon">
                            <input 
                              type="date" 
                              className="form-input" 
                              style={{ paddingLeft: '14px' }}
                              value={slots.returnDate || ''} 
                              onChange={(e) => setSlots({...slots, returnDate: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group" style={{ flex: '0.4' }}>
                          <label>Passengers</label>
                          <div className="input-with-icon">
                            <Users size={18} className="input-icon" />
                            <input 
                              type="number" 
                              min="1" max="10"
                              className="form-input" 
                              value={slots.passengerCount || 1} 
                              onChange={(e) => setSlots({...slots, passengerCount: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="form-group" style={{ flex: '0.6' }}>
                          <label>Cabin Class</label>
                          <select 
                            className="form-input" 
                            value={slots.cabinClass || 'Economy'} 
                            onChange={(e) => setSlots({...slots, cabinClass: e.target.value})}
                          >
                            <option>Economy</option>
                            <option>Premium Economy</option>
                            <option>Business</option>
                            <option>First Class</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button className="btn-primary" onClick={handleWidgetSearch} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 24px' }}>
                          <Search size={18} /> Search Flights
                        </button>
                      </div>
                    </div>
                  ) : msg.type === 'flights' ? (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', marginLeft: '32px' }}>
                      {msg.flights.map((flight, idx) => (
                        <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', minWidth: '300px', flex: '1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{flight.airline} {flight.flightNumber}</div>
                            <div style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>{flight.price}</div>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>{flight.departureTime}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{flight.origin}</div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', margin: '0 16px' }}>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Direct</div>
                              <div style={{ height: '2px', background: '#cbd5e1', width: '100%', position: 'relative' }}>
                                <PlaneTakeoff size={14} style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', color: '#94a3b8' }} />
                              </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>{flight.arrivalTime}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{flight.destination}</div>
                            </div>
                          </div>
                          
                          <button style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>Select Flight</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`bubble \${msg.isSearching ? 'shimmer-text' : ''}`}>
                      {msg.text.split('\\n').map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                  )}
                </div>
                
                <div className="message-meta">
                  {msg.timestamp}
                  {msg.sender === 'user' && <Check size={14} color="#3b82f6" />}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-row assistant">
                <div className="message-bubble-wrapper">
                  <div className="bot-avatar-small">
                    <Bot size={20} />
                  </div>
                  <div className="bubble" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></div>
                    <div style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></div>
                    <div style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="chat-input-wrapper">
            <form className="chat-input-box" onSubmit={handleSend}>
              <button type="button" className="attachment-btn">
                <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Type your message to Azure AI..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="chat-send">
                <Send size={18} />
              </button>
            </form>
            <div className="disclaimer">
              FlyBie Assistant can make mistakes. Please verify important information.
            </div>
          </div>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{__html: "@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }"}} />
    </div>
  );
}

export default ChatbotPage;
