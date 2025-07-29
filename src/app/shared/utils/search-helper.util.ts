/**
 * Enhanced Search Helper Utility
 * Mendukung parsing bulan dan tahun dari query search untuk filtering yang lebih presisi
 * 
 * Features:
 * - Parse month name (Indonesia) dari search query
 * - Parse year dari search query
 * - Kombinasi month + year parsing
 * - Fallback ke original query jika tidak ada match
 */

export interface ParsedSearchQuery {
  originalQuery: string;
  hasMonthFilter: boolean;
  hasYearFilter: boolean;
  month?: number;
  year?: number;
  remainingQuery: string;
  suggestedMonthYear?: { month: number; year: number };
}

export interface MonthYearSuggestion {
  month: number;
  year: number;
  monthName: string;
  confidence: 'high' | 'medium' | 'low';
}

export class SearchHelper {
  
  private static readonly MONTH_MAPPINGS = new Map<string, number>([
    // Full month names
    ['januari', 1], ['februari', 2], ['maret', 3], ['april', 4],
    ['mei', 5], ['juni', 6], ['juli', 7], ['agustus', 8],
    ['september', 9], ['oktober', 10], ['november', 11], ['desember', 12],
    
    // Short month names
    ['jan', 1], ['feb', 2], ['mar', 3], ['apr', 4],
    ['mei', 5], ['jun', 6], ['jul', 7], ['agu', 8],
    ['sep', 9], ['okt', 10], ['nov', 11], ['des', 12],
    
    // Alternative spellings
    ['agust', 8], ['sept', 9], ['dec', 12]
  ]);

  private static readonly MONTH_NAMES = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
  ];

  /**
   * Parse search query untuk mengekstrak informasi bulan dan tahun
   */
  static parseSearchQuery(query: string): ParsedSearchQuery {
    if (!query?.trim()) {
      return {
        originalQuery: query,
        hasMonthFilter: false,
        hasYearFilter: false,
        remainingQuery: query
      };
    }

    const lowerQuery = query.toLowerCase().trim();
    const words = lowerQuery.split(/\s+/);
    
    let foundMonth: number | undefined;
    let foundYear: number | undefined;
    const usedWords = new Set<number>();

    // Parse month
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (this.MONTH_MAPPINGS.has(word)) {
        foundMonth = this.MONTH_MAPPINGS.get(word);
        usedWords.add(i);
        break;
      }
    }

    // Parse year (1500-3001 range untuk fleksibilitas maksimal)
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const yearMatch = word.match(/^(1[5-9][0-9][0-9]|2[0-9][0-9][0-9]|300[01])$/);
      if (yearMatch) {
        foundYear = parseInt(yearMatch[1], 10);
        usedWords.add(i);
        break;
      }
    }

    // Parse combined format "juli 2025" or "2025 juli"
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i];
      const word2 = words[i + 1];
      
      // Check "juli 2025" pattern
      if (this.MONTH_MAPPINGS.has(word1) && word2.match(/^(1[5-9][0-9][0-9]|2[0-9][0-9][0-9]|300[01])$/)) {
        foundMonth = this.MONTH_MAPPINGS.get(word1);
        foundYear = parseInt(word2, 10);
        usedWords.add(i);
        usedWords.add(i + 1);
        break;
      }
      
      // Check "2025 juli" pattern
      if (word1.match(/^(1[5-9][0-9][0-9]|2[0-9][0-9][0-9]|300[01])$/) && this.MONTH_MAPPINGS.has(word2)) {
        foundYear = parseInt(word1, 10);
        foundMonth = this.MONTH_MAPPINGS.get(word2);
        usedWords.add(i);
        usedWords.add(i + 1);
        break;
      }
    }

    // Build remaining query (words not used for month/year)
    const remainingWords = words.filter((_, index) => !usedWords.has(index));
    const remainingQuery = remainingWords.join(' ').trim();

    const result: ParsedSearchQuery = {
      originalQuery: query,
      hasMonthFilter: foundMonth !== undefined,
      hasYearFilter: foundYear !== undefined,
      remainingQuery,
      month: foundMonth,
      year: foundYear
    };

    // Add suggestion if we have month or year
    if (foundMonth || foundYear) {
      result.suggestedMonthYear = {
        month: foundMonth || new Date().getMonth() + 1,
        year: foundYear || new Date().getFullYear()
      };
    }

    return result;
  }

  /**
   * Generate month suggestions berdasarkan partial input
   */
  static getMonthSuggestions(partialInput: string): MonthYearSuggestion[] {
    if (!partialInput?.trim()) return [];

    const input = partialInput.toLowerCase().trim();
    const suggestions: MonthYearSuggestion[] = [];
    const currentYear = new Date().getFullYear();

    this.MONTH_MAPPINGS.forEach((monthNumber, monthKey) => {
      if (monthKey.startsWith(input)) {
        const confidence = monthKey === input ? 'high' : 
                         monthKey.startsWith(input) && input.length >= 3 ? 'medium' : 'low';
        
        suggestions.push({
          month: monthNumber,
          year: currentYear,
          monthName: this.MONTH_NAMES[monthNumber - 1],
          confidence
        });
      }
    });

    // Sort by confidence and then by month number
    return suggestions.sort((a, b) => {
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      if (confidenceOrder[a.confidence] !== confidenceOrder[b.confidence]) {
        return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
      }
      return a.month - b.month;
    });
  }

  /**
   * Format month name untuk display
   */
  static formatMonthYear(month: number, year: number): string {
    if (month < 1 || month > 12) return '';
    return `${this.MONTH_NAMES[month - 1]} ${year}`;
  }

  /**
   * Check if query contains date-related terms
   */
  static containsDateTerms(query: string): boolean {
    if (!query?.trim()) return false;
    
    const lowerQuery = query.toLowerCase();
    const dateTerms = ['tahun', 'bulan', 'month', 'year'];
    
    return dateTerms.some(term => lowerQuery.includes(term)) ||
           this.parseSearchQuery(query).hasMonthFilter ||
           this.parseSearchQuery(query).hasYearFilter;
  }

  /**
   * Generate search suggestions based on current month context
   */
  static generateContextualSuggestions(currentMonth: number, currentYear: number): string[] {
    const currentMonthName = this.MONTH_NAMES[currentMonth - 1].toLowerCase();
    
    return [
      `${currentMonthName} ${currentYear}`,
      `${currentMonthName}`,
      `${currentYear}`,
      `${currentMonthName} ${currentYear - 1}`,
      `${currentMonthName} ${currentYear + 1}`
    ];
  }

  /**
   * Build enhanced query params with month/year context
   */
  static buildEnhancedQueryParams(
    parsedQuery: ParsedSearchQuery,
    defaultMonth?: number,
    defaultYear?: number
  ): { searchQuery: string; month?: number; year?: number; startDate?: string; endDate?: string } {
    
    const month = parsedQuery.month || defaultMonth;
    const year = parsedQuery.year || defaultYear;
    
    let startDate: string | undefined;
    let endDate: string | undefined;
    
    if (month && year) {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      startDate = monthStart.toISOString().split('T')[0];
      endDate = monthEnd.toISOString().split('T')[0];
    }

    return {
      searchQuery: parsedQuery.remainingQuery || parsedQuery.originalQuery,
      month,
      year,
      startDate,
      endDate
    };
  }
}
