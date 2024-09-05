import React from 'react';
import VideoSection from './VideoSection';
import AIPanel from './AIPanel';

const PodcastCopilot: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <VideoSection />
      <AIPanel />
    </div>
  );
};

export default PodcastCopilot;