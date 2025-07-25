import { useEffect, useRef } from 'react';

export const useWidget = (matchId: string | number) => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const loadWidget = async () => {
      if (scriptLoaded.current) return;

      try {
        // Check if script already exists
        let script = document.querySelector('script[src="https://widgets.api-sports.io/2.0.3/widgets.js"]') as HTMLScriptElement;
        
        if (!script) {
          script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://widgets.api-sports.io/2.0.3/widgets.js';
          document.head.appendChild(script);
        }

        // Wait for script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        scriptLoaded.current = true;
        console.log('Widget script loaded successfully');
      } catch (error) {
        console.error('Failed to load widget script:', error);
      }
    };

    loadWidget();
  }, []);

  return { scriptLoaded: scriptLoaded.current };
}; 