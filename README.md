# GolfNow Frontend Interview Practice App

A comprehensive Vue 3 + TypeScript + Tailwind CSS application for practicing frontend development skills relevant to GolfNow interviews.

## Features

- **Tee Time Booking**: Interactive booking interface with filtering and pagination
- **Coding Challenges**: Vue.js and JavaScript challenges with test execution
- **Component Communication**: Examples of props, emits, provide/inject, and slots
- **Reactive Data Management**: Practice with ref, reactive, computed, and watchers
- **JavaScript Fundamentals**: Core JS concepts for frontend interviews
- **Testing with Vitest**: Unit testing and TDD practices
- **Data Fetching & APIs**: API integration patterns and error handling
- **Vue Debugging Practice**: Interactive debugging scenarios
- **CSS Best Practices**: Responsive design with Tailwind CSS
- **Practice Arena**: Free-form coding environment

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

## Vue DevTools Configuration

This project is configured to work with Vue DevTools:

### Browser Extension
1. Install the Vue DevTools browser extension:
   - [Chrome Extension](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
   - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

2. The extension should automatically detect Vue applications when running in development mode

### Features Enabled
- **Component inspection**: View component hierarchy and props
- **Reactivity debugging**: Track reactive data changes
- **Performance monitoring**: Component render times and lifecycle hooks
- **Production support**: DevTools work in production builds
- **Router integration**: Debug Vue Router navigation

### Usage Tips
- Open DevTools (F12) and look for the "Vue" tab
- Use the component tree to inspect component states
- Monitor reactive data changes in real-time
- Debug computed properties and watchers
- Inspect router state and navigation

### Configuration Details
The project includes:
- `__VUE_PROD_DEVTOOLS__: true` for production DevTools support
- Performance monitoring enabled in development
- Reactivity transform support

Learn more about [Vue DevTools](https://devtools.vuejs.org/) in the official documentation.
