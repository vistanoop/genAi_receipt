"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Brain, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * AI Financial Copilot Page
 * Natural language chat interface for financial questions
 * AI explains, never calculates
 */
export default function AdvisorPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI Financial Copilot. Ask me anything about your finances. For example:\n\n• How is my financial health?\n• Can I afford to spend ₹5000?\n• What will my month-end balance be?\n• How are my goals doing?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from AI');
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <h1 className="text-xl font-bold gradient-title">AI Financial Copilot</h1>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full px-4 py-8">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white'
                      : 'glassmorphism'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 justify-start"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="glassmorphism rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="glassmorphism rounded-2xl p-4">
          <div className="flex gap-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your finances..."
              className="flex-1 text-lg"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-3">Quick questions:</div>
            <div className="flex flex-wrap gap-2">
              {[
                "How is my financial health?",
                "Can I afford ₹10,000?",
                "What's my month-end balance?",
                "How are my goals?",
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="px-4 py-2 rounded-full border border-border hover:border-purple-500/50 text-sm transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
