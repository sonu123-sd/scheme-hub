import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import schemes from '@/data/schemes.json';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};
const Chatbot = () => {
const [isOpen, setIsOpen] = useState(false);
const initialMessages: Message[] = [
  {
    role: 'assistant',
    content:
      'Namaste! 🙏 I am your Scheme Hub AI Assistant. How can I help you today?',
  },
];
const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

const isGreeting = (text: string) =>
  /^(h+i+|h+e+l+o+|h+e+y+|n+a+m+a+s+t+e+|n+a+m+a+s+k+a+r+)$/i.test(
    text.trim()
  );
const isNewsQuery = (text: string) =>
  ['news', 'latest', 'updates', 'what is new', 'new schemes'].some((w) =>
    text.includes(w)
  );

const isSpotlightQuery = (text: string) =>
  ['spotlight', 'featured', 'highlighted', 'top schemes'].some((w) =>
    text.includes(w)
  );

  const contains = (text: string, words: string[]) =>
    words.some((w) => text.includes(w));

  const findScheme = (query: string) => {
    const q = query.toLowerCase();
    return schemes.find((scheme: any) =>
      scheme.name.toLowerCase().includes(q)
    );
  };

  const generateResponse = (userMessage: string) => {
    const text = userMessage.toLowerCase().trim();

    /* Greeting */
    if (isGreeting(text)) {
      return 'How can I help you today?.';
    }
  /* News */
if (isNewsQuery(text)) {
  return `
Latest News & Updates:

• Newly launched government schemes  
• Recent policy updates  
• Application deadlines  
• Eligibility or benefit changes  

Check News section on website for latest updates.
`;
}

/* Spotlight */
if (isSpotlightQuery(text)) {
  return `
Spotlight Schemes:

• Popular and trending schemes  
• High benefit schemes  
• Time-sensitive schemes  
• Government priority programs  

Check Spotlight section to see highlighted schemes.
`;
}
    /* Dashboard */
    if (contains(text, ['dashboard'])) {
      return `
Dashboard Features:

• Profile Management – Update your personal details  
• Eligibility Checker – Find schemes matching your profile  
• Saved Schemes – Bookmark schemes for later  
• Document Vault – Upload Aadhaar, income proof, etc.  
• Application Tracking – Track applied schemes  

You can access Dashboard after login from top menu.
`;
    }

    /* Profile */
    if (contains(text, ['profile'])) {
      return `
Profile Section:

• Update name, gender, age, income  
• Used for eligibility checking  
• Helps in personalized scheme suggestions  

Keep profile updated for best results.
`;
    }

    /* Documents */
    if (contains(text, ['document', 'documents'])) {
      return `
Document Vault:

• Upload Aadhaar Card  
• Income Certificate  
• Caste Certificate (if required)  
• Bank Passbook  

Documents are reused while applying to schemes.
`;
    }

    /* Saved Schemes */
    if (contains(text, ['saved', 'bookmark'])) {
      return `
Saved Schemes:

• Bookmark schemes you like  
• Access later from dashboard  
• Compare schemes easily  

Use Save button on any scheme page.
`;
    }

    /* Eligibility */
    if (contains(text, ['eligibility', 'eligible'])) {
      return `
Eligibility Checker:

• Enter age, gender, income, category  
• System finds matching schemes  
• Saves time and avoids confusion  

Available inside Dashboard.
`;
    }

    /* Apply */
    if (contains(text, ['apply', 'application'])) {
      return `
How Apply Works:

• Open scheme details  
• Check eligibility & documents  
• Click Apply Now  
• Redirect to official portal  
• Fill form and submit  

Some schemes are online, some offline.
`;
    }

    /* About Website */
    if (contains(text, ['about', 'scheme hub', 'website', 'platform'])) {
      return `
About Scheme Hub:

Scheme Hub is a platform to discover Government Schemes easily.

• Central & State schemes  
• Easy eligibility check  
• Clear documents list  
• Direct apply links  
• Secure user dashboard  

Goal is to help citizens apply correctly.`;
    }

    /* Scheme Search */
    const scheme = findScheme(text);

    if (!scheme) {
      return 'Scheme not found. Please type exact scheme name or ask about website features.';
    }

    return `
Scheme Name: ${scheme.name}

State: ${scheme.state || 'Not specified'}

Category: ${scheme.category || 'Not specified'}

Description:
${scheme.description || 'Not available'}

Eligibility:
${scheme.eligibility || 'Not specified'}

Benefits:
${scheme.benefits || 'Not specified'}

Documents Required:
${
  Array.isArray(scheme.documents_required)
    ? scheme.documents_required.join(', ')
    : 'Not specified'
}

How to Apply:
${
  Array.isArray(scheme.apply_steps)
    ? scheme.apply_steps.join(' → ')
    : 'Check official portal'
}

Official Link:
${scheme.official_link || 'Not available'}
`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => {
          if (isOpen) {
            setMessages(initialMessages); // reset chat
            setInput('');
            setIsTyping(false);
          }
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] shadow-2xl flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-6 w-6" />
              Scheme Hub Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${
                      message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
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
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
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
                    <div className="bg-muted rounded-lg px-4 py-2 text-sm">
                      Typing...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type scheme name or question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
