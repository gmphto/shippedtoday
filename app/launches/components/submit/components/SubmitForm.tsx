'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useSubmitForm } from '../hooks/useSubmitForm';
import { LaunchSubmissionSchema, type LaunchSubmission } from '../../../types';

export const SubmitFormPropsSchema = z.object({
  className: z.string().optional(),
});

type SubmitFormProps = z.infer<typeof SubmitFormPropsSchema>;

export function SubmitForm({ className = '' }: SubmitFormProps) {
  const { handleSubmit, isSubmitting, error } = useSubmitForm();
  const [formData, setFormData] = useState<LaunchSubmission>({
    tweetUrl: '',
    title: '',
    url: '',
    description: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Check for cooldown on mount
  useEffect(() => {
    const stored = localStorage.getItem('last-submission-time');
    if (stored) {
      const lastTime = parseInt(stored);
      setLastSubmissionTime(lastTime);
      
      const now = Date.now();
      const timeSinceLastSubmission = now - lastTime;
      const cooldownPeriod = 10000; // 10 seconds to match server
      
      if (timeSinceLastSubmission < cooldownPeriod) {
        setCooldownRemaining(Math.ceil((cooldownPeriod - timeSinceLastSubmission) / 1000));
      }
    }
  }, []);

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownRemaining > 0) {
      return;
    }
    
    // Store submission time for client-side cooldown
    const now = Date.now();
    localStorage.setItem('last-submission-time', now.toString());
    setLastSubmissionTime(now);
    setCooldownRemaining(10);
    
    await handleSubmit(formData);
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const isFormDisabled = isSubmitting || cooldownRemaining > 0;

  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-700 text-sm">
              {error.includes('Rate limit') && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Too many submissions:</strong> Please wait before submitting again.</span>
                </div>
              )}
              {error.includes('duplicate') && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Duplicate content:</strong> This launch appears to be similar to a recent submission.</span>
                </div>
              )}
              {error.includes('spam') && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Content flagged:</strong> Please ensure your submission is a legitimate product launch.</span>
                </div>
              )}
              {error.includes('too short') && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Content too brief:</strong> Please provide more detailed information about your launch.</span>
                </div>
              )}
              {!error.includes('Rate limit') && !error.includes('duplicate') && !error.includes('spam') && !error.includes('too short') && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {cooldownRemaining > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center text-yellow-700 text-sm">
              <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Please wait {cooldownRemaining} second{cooldownRemaining !== 1 ? 's' : ''} before submitting again...</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="tweetUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Tweet URL (optional)
            </label>
            <input
              type="url"
              id="tweetUrl"
              disabled={isFormDisabled}
              value={formData.tweetUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, tweetUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="https://twitter.com/user/status/123..."
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title * <span className="text-xs text-gray-500">(minimum 10 characters)</span>
            </label>
            <input
              type="text"
              id="title"
              required
              disabled={isFormDisabled}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="What did you ship? (be descriptive)"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Link *
            </label>
            <input
              type="url"
              id="url"
              required
              disabled={isFormDisabled}
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="https://yourproduct.com"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description * <span className="text-xs text-gray-500">(minimum 10 characters)</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              disabled={isFormDisabled}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="Tell us about your launch... What problem does it solve? What makes it unique?"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Stack Tags (optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="tags"
                disabled={isFormDisabled}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="e.g., React, TypeScript, Next.js"
              />
              <button
                type="button"
                disabled={isFormDisabled}
                onClick={handleTagAdd}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                  >
                    {tag}
                    <button
                      type="button"
                      disabled={isFormDisabled}
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-primary-500 hover:text-primary-700 disabled:opacity-50"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={isFormDisabled}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Submit Launch'}
          </button>
        </div>
      </div>
    </form>
  );
} 