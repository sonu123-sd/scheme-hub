import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import schemes from '@/data/schemes.json';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I am your Scheme Hub AI Assistant. Ask me anything about government schemes, eligibility, required documents, or how to apply!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const findSchemes = (query) => {
    const lowerQuery = query.toLowerCase();
    return schemes.filter(scheme => 
      scheme.name.toLowerCase().includes(lowerQuery) ||
      scheme.category.toLowerCase().includes(lowerQuery) ||
      scheme.description.toLowerCase().includes(lowerQuery) ||
      scheme.state?.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  };

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Greeting
    if (lowerMessage.match(/^(hi|hello|hey|namaste|namaskar)/)) {
      return "Namaste! 🙏 How can I help you today? You can ask me about:\n• Finding schemes\n• Eligibility criteria\n• Required documents\n• How to apply\n• Dashboard features";
    }

    // Help with dashboard
    if (lowerMessage.includes('dashboard')) {
      return "The Dashboard allows you to:\n\n1. **Edit Profile** - Update your personal details\n2. **Document Vault** - Upload & store important documents\n3. **Saved Schemes** - View schemes you've saved\n4. **Recently Viewed** - Access schemes you've looked at\n\nGo to Dashboard from the header menu after logging in.";
    }

    // Eligibility
    if (lowerMessage.includes('eligibility') || lowerMessage.includes('eligible')) {
      return "To check your eligibility:\n\n1. Go to **Check Eligibility** page\n2. Fill in your details (age, gender, income, etc.)\n3. Click **Check Eligibility**\n4. View matching schemes\n\nYou can also ask me about specific scheme eligibility!";
    }

    // Documents
    if (lowerMessage.includes('document') || lowerMessage.includes('documents required')) {
      return "Common documents for government schemes:\n\n• Aadhaar Card\n• PAN Card\n• Income Certificate\n• Caste Certificate\n• Ration Card\n• Bank Passbook\n• Passport Size Photo\n\nSpecific documents vary by scheme. Ask about a specific scheme for exact requirements!";
    }

    // How to apply
    if (lowerMessage.includes('how to apply') || lowerMessage.includes('apply for')) {
      return "To apply for schemes:\n\n1. **Search** the scheme on Scheme Hub\n2. Click **View Details** to see requirements\n3. Check eligibility criteria\n4. Gather required documents\n5. Click **Apply Now** to go to official portal\n6. Complete the application form\n\nNeed help with a specific scheme?";
    }

    // About the project
    if (lowerMessage.includes('about') || lowerMessage.includes('what is scheme hub') || lowerMessage.includes('project')) {
      return "**Scheme Hub** is a comprehensive portal to discover Government Schemes!\n\n✅ 48+ Central & State Schemes\n✅ Easy eligibility checker\n✅ Document vault for storage\n✅ Tutorial videos for each scheme\n✅ Direct links to apply\n\nBuilt to help citizens access government benefits easily.";
    }

    // Search for schemes
    const foundSchemes = findSchemes(userMessage);
    if (foundSchemes.length > 0) {
      let response = `I found ${foundSchemes.length} matching scheme(s):\n\n`;
      foundSchemes.forEach((scheme, index) => {
        response += `**${index + 1}. ${scheme.name}**\n`;
        response += `   Type: ${scheme.type}${scheme.state ? ` (${scheme.state})` : ''}\n`;
        response += `   Category: ${scheme.category}\n\n`;
      });
      response += "Click on any scheme in the portal for full details!";
      return response;
    }

    // Categories
    if (lowerMessage.includes('categories') || lowerMessage.includes('category')) {
      const categories = [...new Set(schemes.map(s => s.category))];
      return `Available categories:\n\n${categories.map(c => `• ${c}`).join('\n')}\n\nClick on any category on the homepage to browse schemes!`;
    }

    // States
    if (lowerMessage.includes('state') && (lowerMessage.includes('scheme') || lowerMessage.includes('list'))) {
      const states = [...new Set(schemes.filter(s => s.state).map(s => s.state))];
      return `States with schemes available:\n\n${states.map(s => `• ${s}`).join('\n')}\n\nVisit State Schemes page to browse by state!`;
    }

    // Default response
    return "I can help you with:\n\n• **Finding schemes** - Just type a keyword\n• **Eligibility** - Ask about requirements\n• **Documents** - What papers you need\n• **How to apply** - Step by step guide\n• **Dashboard help** - Using your account\n\nTry asking something like 'PM Kisan' or 'agriculture schemes'!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] shadow-2xl flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-6 w-6" />
              Scheme Hub Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
