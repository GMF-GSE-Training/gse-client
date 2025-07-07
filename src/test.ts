// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Global Sentinels for debugging full page reloads
console.log('--- Global Sentinels Activated ---');

beforeAll(() => {
  try {
    // Sentinel for window.location direct assignment
    let originalLocationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
    if (originalLocationDescriptor && originalLocationDescriptor.configurable) {
      Object.defineProperty(window, 'location', {
        configurable: true,
        set(value) {
          console.error('⚠️ ATTEMPTED window.location SET TO:', value, new Error().stack);
          // To actually prevent navigation during tests (use with caution):
          // throw new Error('Navigation to ' + value + ' blocked by test sentinel.');
          if (originalLocationDescriptor && originalLocationDescriptor.set) {
            originalLocationDescriptor.set.call(window, value);
          } else if (originalLocationDescriptor && originalLocationDescriptor.value) {
            (originalLocationDescriptor as any).value = value; // Fallback for non-setter, less ideal
          }
        },
        get() {
          return originalLocationDescriptor && originalLocationDescriptor.get ? originalLocationDescriptor.get.call(window) : originalLocationDescriptor?.value;
        }
      });
    } else {
      console.warn('Could not redefine window.location, it might not be configurable.');
    }

    // Sentinel for window.location.assign
    const originalAssign = window.location.assign;
    if (typeof originalAssign === 'function') {
      spyOn(window.location, 'assign').and.callFake((url: string | URL) => {
        console.error('⚠️ ATTEMPTED window.location.assign TO:', url, new Error().stack);
        // To actually prevent navigation:
        // throw new Error('Navigation (assign) to ' + url + ' blocked by test sentinel.');
        originalAssign.call(window.location, url);
      });
    } else {
      console.warn('window.location.assign is not a function, cannot spy on it.');
    }

    // Sentinel for window.location.replace
    const originalReplace = window.location.replace;
    if (typeof originalReplace === 'function') {
      spyOn(window.location, 'replace').and.callFake((url: string | URL) => {
        console.error('⚠️ ATTEMPTED window.location.replace WITH:', url, new Error().stack);
        // To actually prevent navigation:
        // throw new Error('Navigation (replace) to ' + url + ' blocked by test sentinel.');
        originalReplace.call(window.location, url);
      });
    } else {
      console.warn('window.location.replace is not a function, cannot spy on it.');
    }

    // Sentinel for window.location.reload
    const originalReload = window.location.reload;
    if (typeof originalReload === 'function') {
      spyOn(window.location, 'reload').and.callFake(() => {
        console.error('⚠️ ATTEMPTED window.location.reload', new Error().stack);
        // To actually prevent navigation:
        // throw new Error('Navigation (reload) blocked by test sentinel.');
        originalReload.call(window.location);
      });
    } else {
      console.warn('window.location.reload is not a function, cannot spy on it.');
    }

  } catch (e) {
    console.error('Error setting up window.location spies:', e);
  }
});

window.addEventListener('error', event => {
  console.error('GLOBAL ERROR EVENT:', event.message, event.filename, event.lineno, event.colno, event.error, new Error().stack);
});

window.addEventListener('unhandledrejection', event => {
  console.error('GLOBAL UNHANDLED REJECTION:', event.reason, new Error().stack);
});
