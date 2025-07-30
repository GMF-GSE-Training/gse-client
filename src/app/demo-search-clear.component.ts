import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-search-clear',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h2>🧪 Demo: Search Clear on Month Navigation</h2>
      
      <div style="margin: 20px 0;">
        <h3>Test Scenario:</h3>
        <ol>
          <li>Navigate to COT list page</li>
          <li>Search for "juli 2026" - should navigate to Juli 2026</li>
          <li>Click month navigation (previous/next) - search should clear automatically</li>
          <li>Verify: search input is empty, data shows for new month</li>
        </ol>
      </div>

      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
        <h4>Expected Behavior:</h4>
        <ul>
          <li>✅ Search "juli 2026" → navigates to Juli 2026 with data</li>
          <li>✅ Click "next month" → search clears, navigates to Agustus 2026</li>
          <li>✅ Click "previous month" → search clears, navigates to back</li>
          <li>✅ Click "current month" → search clears, navigates to current month</li>
        </ul>
      </div>

      <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin-top: 10px;">
        <h4>Console Logs to Watch:</h4>
        <ul>
          <li><code>[SearchHelper]</code> - Query parsing logs</li>
          <li><code>🔍 DETAILED Search Debug</code> - Component search processing</li>
          <li><code>⏪/⏩ MONTH NAVIGATION</code> - Month filter navigation</li>
          <li><code>🧹 AUTO-CLEAR</code> - Search clearing events</li>
        </ul>
      </div>

      <div style="margin-top: 20px;">
        <a href="/cot" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          → Test COT List Page
        </a>
      </div>
    </div>
  `
})
export class DemoSearchClearComponent {}
