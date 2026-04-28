export const event = (name, options = {}) => {
  if (window.fbq) {
    window.fbq('track', name, options);
  }
};