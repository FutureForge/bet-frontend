import React from 'react';

export type MatchEvent = {
  minute: string;
  type: 'goal' | 'yellowCard' | 'redCard' | 'substitution' | 'var';
  description: string;
  score?: string;
};

const MatchEventIcons = {
  goal: "⚽",
  yellowCard: "🟨",
  redCard: "🟥",
  substitution: "🔄",
  var: "🌐",
};

interface MatchTimelineProps {
  events: MatchEvent[];
  period: string;
  periodScore: string;
}

export const MatchTimeline: React.FC<MatchTimelineProps> = ({ events, period, periodScore }) => {
  return (
    <div className="space-y-4">
      {/* Period Header */}
      <div className="bg-[#3475DA] rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">{period}</span>
          <span className="text-sm">{periodScore}</span>
        </div>
      </div>
      
      {/* Events */}
      <div className="space-y-3 ml-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-sm text-[#898F94] w-8">{event.minute}</span>
            <span className="text-lg">{MatchEventIcons[event.type]}</span>
            <span className="text-sm">{event.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 