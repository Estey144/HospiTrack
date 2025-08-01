import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  ChevronRight,
  Menu,
  X,
  DollarSign,
  Video,
  TestTube,
  MessageSquare,
  Settings
} from 'lucide-react';
import './SymptomChecker.css';
import './PatientDashboard.css';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [apiKeySource, setApiKeySource] = useState('env'); // 'env' or 'user'

  // Navigation items for sidebar
  const navigationItems = [
    { path: '/patient-dashboard', label: 'Patient Dashboard', icon: User, color: 'text-blue-600' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, color: 'text-purple-600' },
    { path: '/prescriptions', label: 'Prescriptions', icon: FileText, color: 'text-cyan-600' },
    { path: '/bills', label: 'Bills', icon: DollarSign, color: 'text-yellow-600' },
    { path: '/medical-history', label: 'Medical History', icon: FileText, color: 'text-lime-600' },
    { path: '/insurance', label: 'Insurance', icon: Shield, color: 'text-sky-600' },
    { path: '/ambulance', label: 'Ambulance', icon: Activity, color: 'text-rose-600' },
    { path: '/video-sessions', label: 'Video Sessions', icon: Video, color: 'text-indigo-600' },
    { path: '/lab-tests', label: 'Lab Tests', icon: TestTube, color: 'text-fuchsia-600' },
    { path: '/symptom-checker', label: 'AI Symptom Checker', icon: Brain, color: 'text-emerald-600' },
    { path: '/feedback', label: 'Feedback', icon: MessageSquare, color: 'text-violet-600' }
  ];

  const handleSidebarNavigation = (path) => {
    const separator = path.includes('?') ? '&' : '?';
    const pathWithUserId = `${path}${separator}userId=${user?.id}`;
    navigate(pathWithUserId, { state: { user } });
    setSidebarOpen(false);
  };

  // Function to get user from various sources
  const getUserFromParams = () => {
    // Try navigation state first (highest priority)
    if (location.state?.user) {
      console.log('SymptomChecker: User found in navigation state:', location.state.user);
      return location.state.user;
    }
    
    // Try URL parameters
    const userIdFromUrl = searchParams.get('userId');
    if (userIdFromUrl) {
      console.log('SymptomChecker: User ID found in URL params:', userIdFromUrl);
      return { id: userIdFromUrl };
    }
    
    // Try localStorage as fallback
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('SymptomChecker: User found in localStorage:', parsedUser);
        return parsedUser;
      } catch (error) {
        console.error('SymptomChecker: Error parsing stored user:', error);
      }
    }
    
    console.log('SymptomChecker: No user found in any source');
    return null;
  };

  // Function to handle navigation with authentication check
  const handleAuthenticatedNavigation = (path, additionalState = {}) => {
    if (!user) {
      console.log('SymptomChecker: User not authenticated, redirecting to login');
      // Redirect to login with return path
      navigate('/login', { 
        state: { 
          returnTo: path,
          ...additionalState 
        } 
      });
      return;
    }

    console.log('SymptomChecker: User authenticated, navigating to:', path);
    navigate(path, { 
      state: { 
        user,
        ...additionalState 
      } 
    });
  };

  // OpenRouter API Configuration for HospiTrack AI - Using environment variables
  const OPENROUTER_API_URL = process.env.REACT_APP_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const DEEPSEEK_MODEL = process.env.REACT_APP_DEEPSEEK_MODEL || 'deepseek/deepseek-chat';
  const ENV_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
  
  // Get API key from environment or user input
  const getApiKey = () => {
    if (apiKeySource === 'user' && userApiKey) {
      return userApiKey;
    }
    return ENV_API_KEY;
  };
  
  const API_KEY = getApiKey();

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
    // Check if API key is available
    if (!API_KEY) {
      console.error('OpenRouter API key not found. Please check your environment variables.');
      console.error('Environment variables check:', {
        hasReactAppKey: !!process.env.REACT_APP_OPENROUTER_API_KEY,
        allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENROUTER'))
      });
      throw new Error('API_KEY_MISSING');
    }

    console.log('Making API call to OpenRouter...', {
      url: OPENROUTER_API_URL,
      model: DEEPSEEK_MODEL,
      hasValidKey: API_KEY.startsWith('sk-or-v1-')
    });

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
      console.log('Sending request to OpenRouter API...');
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

      console.log('API Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
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

      // Special handling for missing API key
      if (error.message === 'API_KEY_MISSING') {
        return {
          text: "🔑 I need an API key to provide AI-powered responses. Please click the 'Setup API' button in the top right to configure your OpenRouter API key, or the system administrator needs to set up the environment API key.",
          followUp: ['Setup API Key', 'Use Basic Mode', 'Contact Support'],
          condition: 'API Configuration Required',
          severity: 'monitoring',
          recommendations: ['Click Setup API button', 'Get free API key from openrouter.ai', 'Contact system administrator'],
          requiresApiSetup: true
        };
      }

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
    // Get user data when component mounts
    const userData = getUserFromParams();
    setUser(userData);
    
    // Load saved user API key from localStorage
    const savedApiKey = localStorage.getItem('userOpenRouterApiKey');
    const savedApiKeySource = localStorage.getItem('apiKeySource');
    
    if (savedApiKey) {
      setUserApiKey(savedApiKey);
      setApiKeySource(savedApiKeySource || 'user');
    }
    
    scrollToBottom();
  }, [messages, location.state, searchParams]);

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      text: API_KEY 
        ? "Hello! I'm HospiTrack AI Chatbot, your intelligent health assistant. I can help assess your symptoms and provide general health guidance. Please note that this is not a substitute for professional medical advice."
        : "Hello! I'm HospiTrack AI Chatbot. To provide AI-powered symptom assessment, I need an API key. Please click the 'Setup API' button in the top right corner to configure your OpenRouter API key, or contact your system administrator.",
      timestamp: new Date(),
      isWelcome: true,
      followUp: !API_KEY ? ['Setup API Key', 'Learn More'] : undefined
    };
    setMessages([welcomeMessage]);
  }, [API_KEY]);

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
    if (followUp === 'Setup API Key') {
      setShowApiKeyModal(true);
      return;
    }
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

  // API Key Management Functions
  const handleApiKeySubmit = () => {
    if (userApiKey && userApiKey.startsWith('sk-or-v1-')) {
      localStorage.setItem('userOpenRouterApiKey', userApiKey);
      localStorage.setItem('apiKeySource', 'user');
      setApiKeySource('user');
      setShowApiKeyModal(false);
      alert('API key saved successfully! You can now use the AI features.');
    } else {
      alert('Please enter a valid OpenRouter API key (should start with sk-or-v1-)');
    }
  };

  const handleUseEnvKey = () => {
    if (ENV_API_KEY) {
      localStorage.removeItem('userOpenRouterApiKey');
      localStorage.setItem('apiKeySource', 'env');
      setApiKeySource('env');
      setUserApiKey('');
      setShowApiKeyModal(false);
      alert('Now using environment API key.');
    } else {
      alert('No environment API key found. Please enter your own API key.');
    }
  };

  const handleRemoveUserKey = () => {
    localStorage.removeItem('userOpenRouterApiKey');
    localStorage.removeItem('apiKeySource');
    setUserApiKey('');
    setApiKeySource('env');
    setShowApiKeyModal(false);
  };

  return (
    <div className="patient-dashboard-wrapper">
      {/* Sidebar */}
      {user && (
        <div className={`patient-sidebar ${sidebarOpen ? 'patient-sidebar--open' : ''}`}>
          <div className="patient-sidebar-header">
            <div className="patient-sidebar-title">
              <div className="patient-sidebar-title-text">
                <h2>Patient Portal</h2>
              </div>
              <button 
                className="patient-sidebar-close"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="patient-sidebar-user">
            <div className="patient-sidebar-user-avatar">
              <User size={24} />
            </div>
            <div>
              <div className="patient-sidebar-user-name">{user?.name || 'Patient'}</div>
              <div className="patient-sidebar-user-id">ID: {user?.id || 'N/A'}</div>
            </div>
          </div>

          <nav className="patient-sidebar-nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSidebarNavigation(item.path)}
                  className={`patient-nav-item ${isActive ? 'patient-nav-item--active' : ''}`}
                >
                  <Icon size={18} className={`patient-nav-icon ${item.color}`} />
                  <span className="patient-nav-label">{item.label}</span>
                  {isActive && <div className="patient-nav-indicator" />}
                </button>
              );
            })}
          </nav>

          <div className="patient-sidebar-footer">
            <button 
              onClick={() => navigate('/', { state: { user } })}
              className="patient-home-button"
            >
              <User size={16} />
              Go to Homepage
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Overlay */}
      {user && sidebarOpen && (
        <div 
          className="patient-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="patient-main">
        <div className="symptom-checker-page">
          {/* Header */}
          <div className="symptom-checker-header">
            <div className="symptom-checker-header-left">
              <div className="symptom-page-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {user ? (
                    <button 
                      className="patient-sidebar-toggle-main"
                      onClick={() => setSidebarOpen(true)}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Menu size={20} />
                    </button>
                  ) : (
                    <button 
                      className="symptom-nav-button symptom-nav-button--outline" 
                      onClick={() => navigate('/')}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Home size={16} />
                      Home
                    </button>
                  )}
                  <h1><Brain size={24} /> HospiTrack AI Chatbot</h1>
                </div>
                <p>Get preliminary health guidance with HospiTrack's AI-powered symptom assessment</p>
              </div>
            </div>
            <div className="symptom-checker-header-right">
              <button 
                className="api-key-settings-btn"
                onClick={() => setShowApiKeyModal(true)}
                style={{
                  background: API_KEY ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title={API_KEY ? 'API Key Configured' : 'API Key Required'}
              >
                <Bot size={14} />
                {API_KEY ? 'API Ready' : 'Setup API'}
              </button>
              <div className="ai-status">
                <div className="ai-indicator">
                  <Bot size={20} />
                  <span>HospiTrack AI {API_KEY ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>      {/* Warning Notice */}
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
                          onClick={() => handleAuthenticatedNavigation('/appointments')}
                        >
                          <Calendar size={16} />
                          Book Appointment Now
                        </button>
                        <button 
                          className="doctors-cta-button"
                          onClick={() => handleAuthenticatedNavigation('/doctors')}
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
              {!API_KEY && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#92400e',
                  border: '1px solid #fbbf24'
                }}>
                  <strong>⚠️ Note:</strong> AI features require an API key. Click "Setup API" in the top right to configure.
                </div>
              )}
              <div className="symptoms-grid">
                {quickSymptoms.map((symptom, index) => (
                  <button 
                    key={index}
                    className="quick-symptom-button"
                    onClick={() => handleQuickSymptom(symptom)}
                    disabled={!API_KEY}
                    style={{ 
                      opacity: API_KEY ? 1 : 0.6,
                      cursor: API_KEY ? 'pointer' : 'not-allowed'
                    }}
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
                    onClick={() => handleAuthenticatedNavigation('/appointments')}
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
                  onClick={() => handleAuthenticatedNavigation('/appointments')}
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
                  onClick={() => handleAuthenticatedNavigation('/doctors')}
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
                onClick={() => handleAuthenticatedNavigation('/ambulance')}
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
      </div>

      {/* API Key Configuration Modal */}
      {showApiKeyModal && (
        <div className="api-key-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="api-key-modal" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>
                <Bot size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                AI Configuration
              </h3>
              <button 
                onClick={() => setShowApiKeyModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '8px', 
                marginBottom: '16px',
                fontSize: '14px',
                color: '#374151'
              }}>
                <strong>Current Status:</strong><br />
                Environment API Key: {ENV_API_KEY ? '✅ Available' : '❌ Not Found'}<br />
                User API Key: {userApiKey ? '✅ Configured' : '❌ Not Set'}<br />
                Active Source: {apiKeySource === 'env' ? 'Environment' : 'User Input'}
              </div>
              
              <h4 style={{ color: '#374151', marginBottom: '12px' }}>Option 1: Use Your Own API Key</h4>
              <input
                type="password"
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                placeholder="Enter your OpenRouter API key (sk-or-v1-...)"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button 
                  onClick={handleApiKeySubmit}
                  disabled={!userApiKey}
                  style={{
                    background: userApiKey ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: userApiKey ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Save API Key
                </button>
                {userApiKey && (
                  <button 
                    onClick={handleRemoveUserKey}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {ENV_API_KEY && (
                <>
                  <h4 style={{ color: '#374151', marginBottom: '12px' }}>Option 2: Use Environment API Key</h4>
                  <button 
                    onClick={handleUseEnvKey}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '16px'
                    }}
                  >
                    Use Environment Key
                  </button>
                </>
              )}
              
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fef3c7', 
                borderRadius: '8px', 
                fontSize: '12px',
                color: '#92400e',
                border: '1px solid #fbbf24'
              }}>
                <strong>📝 Note:</strong> Get your free API key from{' '}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#1d4ed8', textDecoration: 'underline' }}
                >
                  openrouter.ai/keys
                </a>
                . Your API key is stored locally and never shared.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
