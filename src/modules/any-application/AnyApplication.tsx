'use client';

import { useLayoutEffect, useRef, useState } from 'react';

type AnyApplicationProps = {
  html: string;
};

export const AnyApplication = ({ html }: AnyApplicationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [htmxLoaded, setHtmxLoaded] = useState(false);

  // Load scripts once on mount
  useLayoutEffect(() => {
    // Check if htmx is already loaded
    if (typeof window !== 'undefined' && (window as any).htmx) {
      setHtmxLoaded(true);
      return;
    }

    // Load htmx if not already loaded
    if (typeof window !== 'undefined' && !(window as any).htmx) {
      const htmxScript = document.createElement('script');
      htmxScript.src = 'https://unpkg.com/htmx.org@2.0.7';
      htmxScript.onload = () => {
        setHtmxLoaded(true);
      };
      document.head.appendChild(htmxScript);
    }

    // Load Tailwind CSS if not already loaded
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="tailwindcss"]')) {
      const tailwindScript = document.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(tailwindScript);
    }
  }, []);

  // Set innerHTML directly and process htmx
  useLayoutEffect(() => {
    if (htmxLoaded && containerRef.current && html && (window as any).htmx) {
      const container = containerRef.current;

      // Set innerHTML directly (bypassing React's reconciliation)
      container.innerHTML = html;

      console.log('AnyApplication: Set innerHTML and processing htmx');
      console.log('Container HTML:', container.innerHTML.substring(0, 200));

      const htmx = (window as any).htmx;

      // Add event listener to inject current markup into every HTMX request
      const configRequestHandler = (evt: any) => {
        // Only intercept requests to our API endpoint
        if (evt.detail.path === '/api/any-application/interact') {
          console.log('AnyApplication: Injecting current markup into request');
          console.log('Existing parameters:', Object.keys(evt.detail.parameters));

          // Get the current HTML from the container
          const currentMarkup = container.innerHTML;

          // Add it to the request parameters (not replacing them)
          evt.detail.parameters['currentMarkup'] = currentMarkup;

          console.log('Parameters after injection:', Object.keys(evt.detail.parameters));
        }
      };

      // Remove old listener if it exists
      container.removeEventListener('htmx:configRequest', configRequestHandler);

      // Add the listener to the container
      container.addEventListener('htmx:configRequest', configRequestHandler);

      // Process immediately after setting innerHTML
      htmx.process(container);

      const hxElements = container.querySelectorAll('[hx-post], [hx-get]');
      console.log('AnyApplication: Found', hxElements.length, 'htmx elements');
      hxElements.forEach((el, i) => {
        console.log(`Element ${i}:`, el.getAttribute('hx-post') || el.getAttribute('hx-get'));
      });

      console.log('AnyApplication: htmx.process() completed');

      // Cleanup function
      return () => {
        container.removeEventListener('htmx:configRequest', configRequestHandler);
      };
    }
  }, [html, htmxLoaded]);

  return (
    <div>
      <div ref={containerRef} />
      <div id="app-error-message" className="text-red-500 p-2"></div>
    </div>
  );
};
