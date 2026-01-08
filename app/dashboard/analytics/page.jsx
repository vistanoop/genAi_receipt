/**
 * Analytics Page
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SpendAheadTimeline from '@/components/spend-ahead-timeline';
import EnhancedAnalytics from '@/components/enhanced-analytics';

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Financial <span className="gradient-title">Analytics</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Deep dive into your spending patterns, trends, and financial insights.
        </p>
      </motion.div>

      <EnhancedAnalytics />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SpendAheadTimeline />
      </motion.div>
    </div>
  );
}
