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
  const [appointmentSuggested, setAppointmentSuggested] = useState(false);

  // OpenRouter API Configuration for HospiTrack AI - Using environment variables
  const OPENROUTER_API_URL = process.env.REACT_APP_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const DEEPSEEK_MODEL = process.env.REACT_APP_DEEPSEEK_MODEL || 'deepseek/deepseek-chat';
  const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY || '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';

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

  // HospiTrack AI API call function (using DeepSeek model)
  const callDeepSeekAPI = async (userInput, conversationHistory = []) => {
    const systemPrompt = `You are HospiTrack AI Chatbot, a professional medical AI assistant for symptom assessment. Your role is to:

1. Provide preliminary symptom assessment and general health guidance
2. Ask relevant follow-up questions to better understand symptoms
3. Recommend appropriate self-care measures when suitable
4. Identify when professional medical attention is needed
5. ALWAYS recommend emergency care for serious symptoms
6. Be empathetic and supportive while maintaining professional boundaries

IMPORTANT GUIDELINES:
- Always emphasize that this is NOT a substitute for professional medical advice
- For emergency symptoms (chest pain, difficulty breathing, severe pain, etc.), immediately recommend calling 911
- After 3-4 exchanges, if symptoms are concerning or persistent, recommend booking an appointment
- Provide practical, evidence-based recommendations
- Ask clarifying questions about symptom onset, severity, location, and associated symptoms
- Be concise but thorough in your responses

CRITICAL: You MUST respond with ONLY valid JSON in exactly this format (no extra text, no markdown, no code blocks):
{
  "text": "Your main response text",
  "severity": "emergency|urgent|needs-evaluation|consultation-recommended|moderate|mild-moderate|mild|monitoring",
  "recommendations": ["recommendation1", "recommendation2", "..."],
  "followUp": ["question1", "question2", "..."],
  "condition": "Brief condition name",
  "suggestAppointment": true/false
}

Do NOT include any text before or after the JSON. Do NOT use markdown formatting or code blocks.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userInput }
    ];

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'HospiTrack Symptom Checker'
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages: messages,
          temperature: 0.3,
          max_tokens: 600,
          top_p: 0.8,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Try to parse as JSON, fallback to text response if parsing fails
      try {
        const parsedResponse = JSON.parse(aiResponse);
        return parsedResponse;
      } catch (parseError) {
        console.log('JSON parsing failed, attempting to extract JSON from response:', parseError);
        
        // Try to extract JSON from response that might have extra text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const extractedResponse = JSON.parse(jsonMatch[0]);
            return extractedResponse;
          } catch (extractError) {
            console.log('JSON extraction failed:', extractError);
          }
        }
        
        // Clean the text response by removing any JSON formatting markers
        const cleanText = aiResponse
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .replace(/^\s*\{[\s\S]*\}\s*/g, '')
          .trim();
        
        // Fallback response if JSON parsing fails completely
        return {
          text: cleanText || "I understand you're experiencing symptoms. Let me help assess your situation. Can you provide more details about what you're experiencing?",
          severity: 'monitoring',
          recommendations: ['Monitor your symptoms', 'Stay hydrated', 'Rest as needed'],
          followUp: ['How long have you had these symptoms?', 'Any other symptoms?', 'Rate severity 1-10'],
          condition: 'General Assessment',
          suggestAppointment: false
        };
      }
    } catch (error) {
      console.error('HospiTrack AI API Error:', error);
      throw error;
    }
  };

  // Enhanced AI response function with HospiTrack AI integration
  const getAIResponse = async (userInput, context = {}) => {
    const input = userInput.toLowerCase();
    const messageCount = messages.length;
    
    // Emergency keywords - immediate response without API call
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe pain', 'unconscious', 'bleeding heavily', 'stroke', 'heart attack', 'can\'t breathe', 'severe chest', 'heart racing', 'suicide', 'overdose'];
    if (emergencyKeywords.some(keyword => input.includes(keyword))) {
      return {
        text: "⚠️ Based on your symptoms, this could be a medical emergency. Please call 911 or go to the nearest emergency room immediately. Do not delay seeking medical attention.",
        severity: 'emergency',
        recommendations: ['Call 911 immediately', 'Go to nearest ER', 'Do not drive yourself'],
        followUp: ['Are you able to call 911 now?', 'Is someone with you?'],
        condition: 'Medical Emergency',
        suggestAppointment: false,
        urgency: 'emergency'
      };
    }

    // Use HospiTrack AI API for all responses (except emergencies)
    try {
      const conversationHistory = messages.slice(-6); // Send last 6 messages for context
      const aiResponse = await callDeepSeekAPI(userInput, conversationHistory);
      
      // Add appointment suggestion logic based on message count
      if (messageCount >= 8 && !aiResponse.suggestAppointment) {
        aiResponse.suggestAppointment = true;
        aiResponse.severity = aiResponse.severity === 'mild' || aiResponse.severity === 'monitoring' 
          ? 'consultation-recommended' 
          : aiResponse.severity;
      }

      return {
        ...aiResponse,
        urgency: aiResponse.severity === 'emergency' ? 'emergency' : 'normal'
      };
    } catch (error) {
      console.error('API call failed, using fallback response:', error);

      // Fallback mock responses for when API is not available
      const generalResponses = [
        {
          text: "I want to help you better understand your symptoms. Can you provide more specific details about what you're experiencing? For example, when did the symptoms start, how severe are they, and are there any patterns you've noticed?",
          followUp: ['Started today', 'Started this week', 'Mild symptoms', 'Moderate symptoms', 'Severe symptoms', 'Getting worse'],
          condition: 'General Assessment',
          severity: 'monitoring',
          recommendations: ['Monitor your symptoms', 'Stay hydrated', 'Rest as needed', 'Note any changes']
        },
        {
          text: "Thank you for sharing that information. Understanding your symptoms fully helps provide better guidance. Are there any other symptoms you're experiencing along with this? Sometimes symptoms can be related.",
          followUp: ['No other symptoms', 'Yes, also have fever', 'Yes, also tired', 'Yes, also pain', 'Multiple symptoms'],
          condition: 'Symptom Assessment',
          severity: 'monitoring',
          recommendations: ['Continue monitoring', 'Stay comfortable', 'Note symptom patterns', 'Maintain good hydration']
        },
        {
          text: "I appreciate you taking the time to describe your symptoms. Health concerns can be worrying, and it's important to address them properly. Can you tell me if these symptoms are affecting your daily activities or sleep?",
          followUp: ['Affecting daily life', 'Sleep problems', 'Can manage normally', 'Getting concerned', 'Need relief'],
          condition: 'Impact Assessment',
          severity: messageCount >= 8 ? 'consultation-recommended' : 'monitoring',
          recommendations: ['Monitor impact on daily life', 'Track sleep patterns', 'Note functional limitations', 'Consider professional consultation if symptoms persist']
        }
      ];

      const response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      
      return {
        text: response.text,
        followUp: response.followUp,
        condition: response.condition,
        severity: response.severity,
        recommendations: response.recommendations,
        suggestAppointment: messageCount >= 8,
        urgency: 'normal'
      };
    }
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
      text: "Hello! I'm HospiTrack AI Chatbot, your intelligent health assistant. I can help assess your symptoms and provide general health guidance. Please note that this is not a substitute for professional medical advice.",
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

    // Simulate AI processing delay and get response
    setTimeout(async () => {
      try {
        const aiResponse = await getAIResponse(inputMessage, { currentStep, patientData });
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: aiResponse.text,
          timestamp: new Date(),
          followUp: aiResponse.followUp || [],
          assessment: aiResponse.assessment || {
            condition: aiResponse.condition,
            severity: aiResponse.severity,
            recommendations: aiResponse.recommendations
          },
          urgency: aiResponse.urgency || 'normal',
          recommendations: aiResponse.recommendations || [],
          suggestAppointment: aiResponse.suggestAppointment || false
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        // Set assessment if provided
        if (aiResponse.assessment || (aiResponse.condition && aiResponse.severity)) {
          setAssessment(aiResponse.assessment || {
            condition: aiResponse.condition,
            severity: aiResponse.severity,
            recommendations: aiResponse.recommendations
          });
        }

        // Track appointment suggestion
        if (aiResponse.suggestAppointment) {
          setAppointmentSuggested(true);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Fallback error message
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again or consider contacting a healthcare provider directly if you have urgent concerns.",
          timestamp: new Date(),
          urgency: 'normal',
          recommendations: ['Try again in a moment', 'Contact healthcare provider if urgent'],
          followUp: ['Try again', 'Contact doctor', 'Emergency services']
        };

        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
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
      case 'needs-evaluation': return '#f59e0b';
      case 'consultation-recommended': return '#3b82f6';
      case 'moderate': return '#d97706';
      case 'mild-moderate': return '#10b981';
      case 'mild': return '#059669';
      case 'monitoring': return '#6b7280';
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
            <h1><Brain size={24} /> HospiTrack AI Chatbot</h1>
            <p>Get preliminary health guidance with HospiTrack's AI-powered symptom assessment</p>
          </div>
        </div>
        <div className="symptom-checker-header-right">
          <div className="ai-status">
            <div className="ai-indicator">
              <Bot size={20} />
              <span>HospiTrack AI Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="medical-disclaimer">
        <AlertTriangle size={20} />
        <div className="disclaimer-content">
          <h4>Important Medical Disclaimer</h4>
          <p>HospiTrack AI Chatbot is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
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
                  <div className={`message-bubble ${message.urgency || ''} ${message.suggestAppointment ? 'appointment-suggestion' : ''}`}>
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
                    {message.suggestAppointment && (
                      <div className="appointment-suggestion-actions">
                        <button 
                          className="appointment-cta-button"
                          onClick={() => navigate('/appointments')}
                        >
                          <Calendar size={16} />
                          Book Appointment Now
                        </button>
                        <button 
                          className="doctors-cta-button"
                          onClick={() => navigate('/doctors')}
                        >
                          <Stethoscope size={16} />
                          Find Doctors
                        </button>
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

              {(assessment.severity === 'consultation-recommended' || assessment.severity === 'needs-evaluation' || appointmentSuggested) && (
                <div className="appointment-recommendation">
                  <div className="appointment-rec-header">
                    <Calendar size={16} />
                    <span>Professional Consultation Recommended</span>
                  </div>
                  <p>Based on your symptoms and our assessment, we recommend scheduling an appointment with a healthcare provider for proper evaluation and treatment.</p>
                  <button 
                    className="appointment-rec-button"
                    onClick={() => navigate('/appointments')}
                  >
                    <Calendar size={16} />
                    Schedule Appointment
                  </button>
                </div>
              )}

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
                onClick={() => navigate('/branches')}
              >
                <MapPin size={16} />
                Find Nearby Hospitals
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
