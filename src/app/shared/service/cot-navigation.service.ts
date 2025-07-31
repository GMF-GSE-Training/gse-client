import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface CotFilterState {
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  timestamp?: number;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CotNavigationService {
  private readonly COT_BACK_URL_KEY = 'cot_back_url';
  private readonly COT_FILTER_STATE_KEY = 'cot_filter_state';

  constructor(private router: Router) {}

  /**
   * Save the current COT list URL with full parameters for back navigation
   */
  saveBackUrl(url: string): void {
    try {
      sessionStorage.setItem(this.COT_BACK_URL_KEY, url);
      console.log('💾 SAVED back URL:', { url, key: this.COT_BACK_URL_KEY });
    } catch (error) {
      console.warn('⚠️ Failed to save back URL to session storage:', error);
    }
  }

  /**
   * Get the saved back URL, or generate one from saved filter state
   */
  getBackUrl(): string {
    try {
      // First try to get the direct back URL
      const savedUrl = sessionStorage.getItem(this.COT_BACK_URL_KEY);
      if (savedUrl) {
        console.log('📖 RETRIEVED back URL from session storage:', { url: savedUrl });
        return savedUrl;
      }

      // If no direct URL, try to construct one from filter state
      const filterState = this.getFilterState();
      if (filterState && this.isValidFilterState(filterState)) {
        const constructedUrl = this.constructUrlFromFilterState(filterState);
        console.log('🔧 CONSTRUCTED back URL from filter state:', { 
          constructedUrl, 
          filterState 
        });
        return constructedUrl;
      }
    } catch (error) {
      console.warn('⚠️ Failed to retrieve back URL from session storage:', error);
    }

    // Fallback to base URL
    console.log('📅 FALLBACK - Using base COT URL');
    return '/cot';
  }

  /**
   * Navigate back to COT list with preserved state
   */
  navigateBack(): void {
    const backUrl = this.getBackUrl();
    console.log('🔙 NAVIGATING BACK to:', { backUrl });
    this.router.navigateByUrl(backUrl);
  }

  /**
   * Save current filter state for future reference
   */
  saveFilterState(filterState: CotFilterState): void {
    try {
      const stateToSave = {
        ...filterState,
        timestamp: Date.now(),
        url: this.router.url
      };
      sessionStorage.setItem(this.COT_FILTER_STATE_KEY, JSON.stringify(stateToSave));
      
      console.log('💾 SAVED filter state to session storage:', {
        savedState: stateToSave,
        key: this.COT_FILTER_STATE_KEY
      });
    } catch (error) {
      console.warn('⚠️ Failed to save filter state to session storage:', error);
    }
  }

  /**
   * Get saved filter state
   */
  getFilterState(): CotFilterState | null {
    try {
      const saved = sessionStorage.getItem(this.COT_FILTER_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📖 RETRIEVED filter state from session storage:', {
          retrievedState: parsed,
          key: this.COT_FILTER_STATE_KEY
        });
        return parsed;
      }
    } catch (error) {
      console.warn('⚠️ Failed to retrieve filter state from session storage:', error);
    }
    return null;
  }

  /**
   * Validate if filter state is still valid
   */
  private isValidFilterState(filterState: CotFilterState): boolean {
    if (!filterState) return false;
    
    // Check if required properties exist
    const hasRequiredProps = Boolean(filterState.month && filterState.year && 
                                    filterState.startDate && filterState.endDate);
    
    // Check if the saved state is not too old (e.g., older than 1 day)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isNotTooOld = Boolean(filterState.timestamp && 
                               (Date.now() - filterState.timestamp) < maxAge);
    
    // Check if month/year values are reasonable
    const isReasonableDate = Boolean(filterState.month >= 1 && filterState.month <= 12 &&
                                    filterState.year >= 2020 && filterState.year <= 2030);
    
    const isValid = hasRequiredProps && isNotTooOld && isReasonableDate;
    
    console.log('🔍 VALIDATING filter state:', {
      filterState,
      validation: {
        hasRequiredProps,
        isNotTooOld,
        isReasonableDate,
        isValid
      },
      age: filterState.timestamp ? `${((Date.now() - filterState.timestamp) / 1000 / 60).toFixed(1)} minutes` : 'unknown'
    });
    
    return isValid;
  }

  /**
   * Construct URL from filter state
   */
  private constructUrlFromFilterState(filterState: CotFilterState): string {
    const params = new URLSearchParams();
    
    // Required parameters
    params.set('month', filterState.month.toString());
    params.set('year', filterState.year.toString());
    params.set('startDate', filterState.startDate);
    params.set('endDate', filterState.endDate);
    
    // Optional parameters
    if (filterState.searchQuery) {
      params.set('q', filterState.searchQuery);
    }
    if (filterState.sortBy) {
      params.set('sort_by', filterState.sortBy);
    }
    if (filterState.sortOrder) {
      params.set('sort_order', filterState.sortOrder);
    }
    if (filterState.page && filterState.page > 1) {
      params.set('page', filterState.page.toString());
    }
    
    return `/cot?${params.toString()}`;
  }

  /**
   * Clear all saved navigation state
   */
  clearNavigationState(): void {
    try {
      sessionStorage.removeItem(this.COT_BACK_URL_KEY);
      sessionStorage.removeItem(this.COT_FILTER_STATE_KEY);
      console.log('🗑️ CLEARED all navigation state from session storage');
    } catch (error) {
      console.warn('⚠️ Failed to clear navigation state from session storage:', error);
    }
  }
}
