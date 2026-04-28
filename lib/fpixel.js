export const pageview = () => {
  // typeof window চেক করা বাধ্যতামূলক
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const event = (name, options = {}) => {
  // এখানেও একই চেক বসাতে হবে
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};