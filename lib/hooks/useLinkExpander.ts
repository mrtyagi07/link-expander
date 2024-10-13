'use client';

import { useState, useEffect } from 'react';

interface ExpandedData {
  originalUrl: string;
  expandedUrl: string;
  title: string;
  description: string;
  trustScore: number;
  isSafe: boolean;
}

interface LinkHistoryItem {
  original: string;
  expanded: string;
  date: string;
  safe: boolean;
}

export function useLinkExpander() {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [expandedData, setExpandedData] = useState<ExpandedData | null>(null);
  const [linkHistory, setLinkHistory] = useState<LinkHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem('linkHistory');
    if (storedHistory) {
      setLinkHistory(JSON.parse(storedHistory));
    }
  }, []);

  const saveToLocalStorage = (history: LinkHistoryItem[]) => {
    localStorage.setItem('linkHistory', JSON.stringify(history));
  };

  const handleExpand = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to expand URL');
      }

      const data: ExpandedData = await response.json();
      setExpandedData(data);

      const newHistory: LinkHistoryItem[] = [
        {
          original: inputUrl,
          expanded: data.expandedUrl,
          date: new Date().toISOString().split('T')[0],
          safe: data.isSafe
        },
        ...linkHistory
      ].slice(0, 10); // Keep only the last 10 items

      setLinkHistory(newHistory);
      saveToLocalStorage(newHistory);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Text copied to clipboard');
      },
      (err) => {
        console.error('Failed to copy text: ', err);
      }
    );
  };

  const clearHistory = () => {
    setLinkHistory([]);
    localStorage.removeItem('linkHistory');
  };

  return {
    inputUrl,
    setInputUrl,
    expandedData,
    linkHistory,
    isLoading,
    handleExpand,
    copyToClipboard,
    clearHistory,
  };
}