// Mock para react-markdown
const React = require('react');

module.exports = function ReactMarkdown({ children }) {
  return React.createElement('div', { 'data-testid': 'react-markdown' }, children);
};

module.exports.default = module.exports;
