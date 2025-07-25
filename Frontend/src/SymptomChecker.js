import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  ArrowLeft, 
  Home, 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Info, 
  Clock, 
  Heart, 
  Thermometer, 
  Activity, 
  Stethoscope,
  Phone,
  MapPin,
  Star,
  RefreshCw,
  Shield,
  CheckCircle,
  Calendar,
  FileText,
  ChevronRight
} from 'lucide-react';
import './SymptomChecker.css';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState('initial');
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    symptoms: [],
    severity: '',
    duration: '',
    medicalHistory: []
  });
  const [showQuickSymptoms, setShowQuickSymptoms] = useState(true);
  const [chatStarted, setChatStarted] = useState(false);
  const [assessment, setAssessment] = useState(null);

  // Common symptoms for quick selection
  const quickSymptoms = [
    { name: 'Headache', icon: '🤕', category: 'neurological' },
    { name: 'Fever', icon: '🌡️', category: 'general' },
    { name: 'Cough', icon: '😷', category: 'respiratory' },
    { name: 'Sore Throat', icon: '😮', category: 'respiratory' },
    { name: 'Chest Pain', icon: '💔', category: 'cardiac' },
    { name: 'Stomach Pain', icon: '🤢', category: 'gastrointestinal' },
    { name: 'Nausea', icon: '🤮', category: 'gastrointestinal' },
    { name: 'Fatigue', icon: '😴', category: 'general' },
    { name: 'Dizziness', icon: '😵', category: 'neurological' },
    { name: 'Rash', icon: '🔴', category: 'dermatological' },
    { name: 'Joint Pain', icon: '🦴', category: 'musculoskeletal' },
    { name: 'Shortness of Breath', icon: '🫁', category: 'respiratory' }
  ];

  // Mock AI responses based on symptoms
  const getAIResponse = (userInput, context = {}) => {
    const input = userInput.toLowerCase();
    
    // Emergency keywords
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe pain', 'unconscious', 'bleeding heavily', 'stroke', 'heart attack'];
    if (emergencyKeywords.some(keyword => input.includes(keyword))) {
      return {
        text: "⚠️ Based on your symptoms, this could be a medical emergency. Please call 911 or go to the nearest emergency room immediately. Do not delay seeking medical attention.",
        urgency: 'emergency',
        recommendations: ['Call 911 immediately', 'Go to nearest ER', 'Do not drive yourself']
      };
    }

    // Symptom-specific responses
    if (input.includes('headache')) {
      return {
        text: "I understand you're experiencing a headache. Let me help assess this. Can you tell me more about the pain? Is it throbbing, sharp, or dull? How long have you had it?",
        followUp: ['When did the headache start?', 'Rate the pain from 1-10', 'Any nausea or sensitivity to light?'],
        assessment: {
          condition: 'Headache Assessment',
          severity: 'mild-moderate',
          recommendations: ['Rest in a dark room', 'Stay hydrated', 'Consider over-the-counter pain relief', 'Monitor symptoms']
        }
      };
    }

    if (input.includes('fever')) {
      return {
        text: "A fever can indicate your body is fighting an infection. What's your current temperature? Are you experiencing any other symptoms like chills, body aches, or fatigue?",
        followUp: ['What is your temperature?', 'Any chills or sweating?', 'How long have you had the fever?'],
        assessment: {
          condition: 'Fever Assessment',
          severity: 'moderate',
          recommendations: ['Monitor temperature regularly', 'Stay hydrated', 'Rest', 'Consider fever reducers', 'Seek care if fever >101.3°F persists']
        }
      };
    }

    if (input.includes('cough')) {
      return {
        text: "I see you have a cough. Is it a dry cough or are you producing mucus? Any associated symptoms like fever, shortness of breath, or chest pain?",
        followUp: ['Dry or productive cough?', 'Any fever?', 'Difficulty breathing?', 'How long have you had it?'],
        assessment: {
          condition: 'Cough Assessment',
          severity: 'mild-moderate',
          recommendations: ['Stay hydrated', 'Use honey for throat relief', 'Avoid irritants', 'Rest', 'Monitor for worsening symptoms']
        }
      };
    }

    if (input.includes('stomach') || input.includes('nausea')) {
      return {
        text: "Stomach issues can be uncomfortable. Can you describe the pain? Is it cramping, sharp, or burning? Any nausea, vomiting, or changes in bowel movements?",
        followUp: ['Type of pain?', 'Any vomiting?', 'When did you last eat?', 'Any fever?'],
        assessment: {
          condition: 'Gastrointestinal Assessment',
          severity: 'mild-moderate',
          recommendations: ['Stay hydrated with clear fluids', 'BRAT diet (bananas, rice, applesauce, toast)', 'Rest', 'Avoid dairy and fatty foods']
        }
      };
    }

    // Age/gender collection
    if (input.includes('age') || input.match(/\d+/)) {
      return {
        text: "Thank you for that information. This helps me provide more accurate guidance. What other symptoms are you experiencing?",
        context: 'collecting_info'
      };
    }

    // General responses
    const generalResponses = [
      {
        text: "I understand you're not feeling well. Can you describe your main symptoms in detail? This will help me provide better guidance.",
        followUp: ['What are your main symptoms?', 'When did they start?', 'Rate severity 1-10']
      },
      {
        text: "Thank you for sharing that information. Based on what you've told me, I'd like to ask a few more questions to better understand your condition.",
        context: 'assessment'
      },
      {
        text: "I'm here to help assess your symptoms. Please remember that this is not a replacement for professional medical advice. If you're experiencing severe symptoms, please seek immediate medical attention.",
        context: 'disclaimer'
      }
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your AI Health Assistant. I can help assess your symptoms and provide general health guidance. Please note that this is not a substitute for professional medical advice.",
      timestamp: new Date(),
      isWelcome: true
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setChatStarted(true);
    setShowQuickSymptoms(false);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage, { currentStep, patientData });
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse.text,
        timestamp: new Date(),
        followUp: aiResponse.followUp || [],
        assessment: aiResponse.assessment || null,
        urgency: aiResponse.urgency || 'normal',
        recommendations: aiResponse.recommendations || []
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Set assessment if provided
      if (aiResponse.assessment) {
        setAssessment(aiResponse.assessment);
      }
    }, 1500);
  };

  const handleQuickSymptom = (symptom) => {
    setInputMessage(`I'm experiencing ${symptom.name.toLowerCase()}`);
    setShowQuickSymptoms(false);
    setChatStarted(true);
  };

  const handleFollowUpClick = (followUp) => {
    setInputMessage(followUp);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'emergency': return '#dc2626';
      case 'urgent': return '#ea580c';
      case 'moderate': return '#d97706';
      case 'mild': return '#059669';
      default: return '#6b7280';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveAssessment = () => {
    if (assessment) {
      // Create assessment data
      const assessmentData = {
        ...assessment,
        timestamp: new Date(),
        symptoms: patientData.symptoms,
        chatHistory: messages
      };
      
      // Save to localStorage (in real app, this would go to a database)
      const savedAssessments = JSON.parse(localStorage.getItem('savedAssessments') || '[]');
      savedAssessments.push(assessmentData);
      localStorage.setItem('savedAssessments', JSON.stringify(savedAssessments));
      
      // Show success message
      alert('Assessment saved successfully! You can view it in your medical history.');
    }
  };

  return (
    <div className="symptom-checker-page">
      {/* Header */}
      <div className="symptom-checker-header">
        <div className="symptom-checker-header-left">
          <div className="navigation-buttons">
            <button className="symptom-nav-button symptom-nav-button--secondary" onClick={() => navigate('/patient-dashboard')}>
              <ArrowLeft size={16} />
              Patient Dashboard
            </button>
            <button className="symptom-nav-button symptom-nav-button--outline" onClick={() => navigate('/')}>
              <Home size={16} />
              Home
            </button>
          </div>
          <div className="symptom-page-title">
            <h1><Brain size={24} /> AI Symptom Checker</h1>
            <p>Get preliminary health guidance with our AI-powered symptom assessment</p>
          </div>
        </div>
        <div className="symptom-checker-header-right">
          <div className="ai-status">
            <div className="ai-indicator">
              <Bot size={20} />
              <span>AI Assistant Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="medical-disclaimer">
        <AlertTriangle size={20} />
        <div className="disclaimer-content">
          <h4>Important Medical Disclaimer</h4>
          <p>This AI symptom checker is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="emergency-notice">
        <Phone size={20} />
        <div className="emergency-content">
          <span className="emergency-title">Medical Emergency?</span>
          <span className="emergency-text">Call 911 or go to your nearest emergency room immediately</span>
        </div>
        <button className="emergency-button">
          <Phone size={16} />
          Call 911
        </button>
      </div>

      <div className="symptom-checker-container">
        {/* Chat Interface */}
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-title">
              <MessageCircle size={20} />
              <span>Health Assessment Chat</span>
            </div>
            <button className="chat-reset" onClick={() => window.location.reload()}>
              <RefreshCw size={16} />
              New Assessment
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-content">
                  <div className={`message-bubble ${message.urgency || ''}`}>
                    <p>{message.text}</p>
                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="recommendations">
                        <strong>Recommendations:</strong>
                        <ul>
                          {message.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {message.followUp && message.followUp.length > 0 && (
                    <div className="follow-up-questions">
                      <span className="follow-up-label">Quick responses:</span>
                      <div className="follow-up-buttons">
                        {message.followUp.map((followUp, index) => (
                          <button 
                            key={index}
                            className="follow-up-button"
                            onClick={() => handleFollowUpClick(followUp)}
                          >
                            {followUp}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="typing-text">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Symptoms */}
          {showQuickSymptoms && !chatStarted && (
            <div className="quick-symptoms">
              <h4>Common Symptoms - Click to start assessment:</h4>
              <div className="symptoms-grid">
                {quickSymptoms.map((symptom, index) => (
                  <button 
                    key={index}
                    className="quick-symptom-button"
                    onClick={() => handleQuickSymptom(symptom)}
                  >
                    <span className="symptom-icon">{symptom.icon}</span>
                    <span className="symptom-name">{symptom.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="message-input-container">
            <div className="message-input">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms in detail..."
                rows={3}
              />
              <button 
                className="send-button"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Panel */}
        <div className="assessment-panel">
          <div className="assessment-header">
            <h3>
              <Activity size={20} />
              Current Assessment
            </h3>
          </div>

          {assessment ? (
            <div className="assessment-content">
              <div className="assessment-condition">
                <h4>{assessment.condition}</h4>
                <span 
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(assessment.severity) }}
                >
                  {assessment.severity.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="assessment-recommendations">
                <h5>Recommendations:</h5>
                <ul>
                  {assessment.recommendations.map((rec, index) => (
                    <li key={index}>
                      <CheckCircle size={14} />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="assessment-actions">
                <button 
                  className="assessment-action-btn primary"
                  onClick={() => navigate('/appointments')}
                >
                  <Calendar size={16} />
                  Book Appointment
                </button>
                <button 
                  className="assessment-action-btn secondary"
                  onClick={handleSaveAssessment}
                >
                  <FileText size={16} />
                  Save Assessment
                </button>
                <button 
                  className="assessment-action-btn secondary"
                  onClick={() => navigate('/doctors')}
                >
                  <Stethoscope size={16} />
                  Find Doctors
                </button>
              </div>
            </div>
          ) : (
            <div className="no-assessment">
              <Stethoscope size={48} />
              <p>Start describing your symptoms to receive an AI-powered health assessment</p>
            </div>
          )}

          {/* Health Tips */}
          <div className="health-tips">
            <h4>
              <Info size={16} />
              Health Tips
            </h4>
            <div className="tips-list">
              <div className="tip-item">
                <Heart size={14} />
                <span>Stay hydrated - drink 8-10 glasses of water daily</span>
              </div>
              <div className="tip-item">
                <Activity size={14} />
                <span>Get 7-9 hours of quality sleep each night</span>
              </div>
              <div className="tip-item">
                <Shield size={14} />
                <span>Wash hands frequently to prevent infections</span>
              </div>
              <div className="tip-item">
                <Thermometer size={14} />
                <span>Monitor your symptoms and seek care when needed</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button 
                className="action-button"
                onClick={() => navigate('/appointments')}
              >
                <Calendar size={16} />
                Book Appointment
                <ChevronRight size={14} />
              </button>
              <button 
                className="action-button"
                onClick={() => navigate('/doctors')}
              >
                <Stethoscope size={16} />
                Find Doctors
                <ChevronRight size={14} />
              </button>
              <button 
                className="action-button"
                onClick={() => navigate('/branches')}
              >
                <MapPin size={16} />
                Find Nearby Hospitals
                <ChevronRight size={14} />
              </button>
              <button 
                className="action-button"
                onClick={() => navigate('/video-sessions')}
              >
                <Phone size={16} />
                Telehealth Consultation
                <ChevronRight size={14} />
              </button>
              <button 
                className="action-button"
                onClick={() => navigate('/ambulance')}
              >
                <Star size={16} />
                Emergency Services
                <ChevronRight size={14} />
              </button>
              <button 
                className="action-button"
                onClick={() => navigate('/lab-tests')}
              >
                <Activity size={16} />
                Lab Tests & Results
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
