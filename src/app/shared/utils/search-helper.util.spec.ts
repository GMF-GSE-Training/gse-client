import { SearchHelper, ParsedSearchQuery } from './search-helper.util';

describe('SearchHelper', () => {
  
  describe('parseSearchQuery', () => {
    
    it('should parse month name correctly', () => {
      const result = SearchHelper.parseSearchQuery('juli');
      expect(result.hasMonthFilter).toBe(true);
      expect(result.month).toBe(7);
      expect(result.remainingQuery).toBe('');
    });

    it('should parse month and year combination', () => {
      const result = SearchHelper.parseSearchQuery('juli 2025');
      expect(result.hasMonthFilter).toBe(true);
      expect(result.hasYearFilter).toBe(true);
      expect(result.month).toBe(7);
      expect(result.year).toBe(2025);
      expect(result.remainingQuery).toBe('');
    });

    it('should parse year and month combination', () => {
      const result = SearchHelper.parseSearchQuery('2025 juli');
      expect(result.hasMonthFilter).toBe(true);
      expect(result.hasYearFilter).toBe(true);
      expect(result.month).toBe(7);
      expect(result.year).toBe(2025);
      expect(result.remainingQuery).toBe('');
    });

    it('should parse month with remaining query', () => {
      const result = SearchHelper.parseSearchQuery('juli forklift training');
      expect(result.hasMonthFilter).toBe(true);
      expect(result.month).toBe(7);
      expect(result.remainingQuery).toBe('forklift training');
    });

    it('should parse year with remaining query', () => {
      const result = SearchHelper.parseSearchQuery('2025 training');
      expect(result.hasYearFilter).toBe(true);
      expect(result.year).toBe(2025);
      expect(result.remainingQuery).toBe('training');
    });

    it('should parse extended year range (1500-3001)', () => {
      // Test minimum year
      const result1500 = SearchHelper.parseSearchQuery('1500 historical');
      expect(result1500.hasYearFilter).toBe(true);
      expect(result1500.year).toBe(1500);
      expect(result1500.remainingQuery).toBe('historical');

      // Test 1800s
      const result1800 = SearchHelper.parseSearchQuery('1850 ancient');
      expect(result1800.hasYearFilter).toBe(true);
      expect(result1800.year).toBe(1850);

      // Test future years
      const result2500 = SearchHelper.parseSearchQuery('2500 future');
      expect(result2500.hasYearFilter).toBe(true);
      expect(result2500.year).toBe(2500);

      // Test maximum year
      const result3001 = SearchHelper.parseSearchQuery('3001 far-future');
      expect(result3001.hasYearFilter).toBe(true);
      expect(result3001.year).toBe(3001);

      // Test invalid years (outside range)
      const result1400 = SearchHelper.parseSearchQuery('1400 too-old');
      expect(result1400.hasYearFilter).toBe(false);
      expect(result1400.remainingQuery).toBe('1400 too-old');

      const result3002 = SearchHelper.parseSearchQuery('3002 too-far');
      expect(result3002.hasYearFilter).toBe(false);
      expect(result3002.remainingQuery).toBe('3002 too-far');
    });

    it('should handle mixed case', () => {
      const result = SearchHelper.parseSearchQuery('JULI 2025 Training');
      expect(result.hasMonthFilter).toBe(true);
      expect(result.hasYearFilter).toBe(true);
      expect(result.month).toBe(7);
      expect(result.year).toBe(2025);
      expect(result.remainingQuery).toBe('training'); // SearchHelper converts to lowercase
    });

    it('should handle short month names', () => {
      const result = SearchHelper.parseSearchQuery('jul 2025');
      expect(result.hasMonthFilter).toBe(true);
      expect(result.month).toBe(7);
    });

    it('should handle no month/year in query', () => {
      const result = SearchHelper.parseSearchQuery('forklift training');
      expect(result.hasMonthFilter).toBe(false);
      expect(result.hasYearFilter).toBe(false);
      expect(result.remainingQuery).toBe('forklift training');
    });

    it('should handle empty query', () => {
      const result = SearchHelper.parseSearchQuery('');
      expect(result.hasMonthFilter).toBe(false);
      expect(result.hasYearFilter).toBe(false);
      expect(result.remainingQuery).toBe('');
    });

    it('should handle all Indonesian month names', () => {
      const months = [
        { name: 'januari', expected: 1 },
        { name: 'februari', expected: 2 },
        { name: 'maret', expected: 3 },
        { name: 'april', expected: 4 },
        { name: 'mei', expected: 5 },
        { name: 'juni', expected: 6 },
        { name: 'juli', expected: 7 },
        { name: 'agustus', expected: 8 },
        { name: 'september', expected: 9 },
        { name: 'oktober', expected: 10 },
        { name: 'november', expected: 11 },
        { name: 'desember', expected: 12 }
      ];

      months.forEach(month => {
        const result = SearchHelper.parseSearchQuery(month.name);
        expect(result.month).toBe(month.expected);
      });
    });

  });

  describe('formatMonthYear', () => {
    
    it('should format month and year correctly', () => {
      const result = SearchHelper.formatMonthYear(7, 2025);
      expect(result).toBe('JULI 2025');
    });

    it('should handle invalid month', () => {
      const result = SearchHelper.formatMonthYear(13, 2025);
      expect(result).toBe('');
    });

    it('should handle zero month', () => {
      const result = SearchHelper.formatMonthYear(0, 2025);
      expect(result).toBe('');
    });

  });

  describe('containsDateTerms', () => {
    
    it('should detect date-related terms', () => {
      expect(SearchHelper.containsDateTerms('cari data tahun 2025')).toBe(true);
      expect(SearchHelper.containsDateTerms('bulan juli')).toBe(true);
      expect(SearchHelper.containsDateTerms('juli 2025')).toBe(true);
    });

    it('should return false for non-date queries', () => {
      expect(SearchHelper.containsDateTerms('forklift training')).toBe(false);
      expect(SearchHelper.containsDateTerms('RC20 equipment')).toBe(false);
    });

  });

  describe('buildEnhancedQueryParams', () => {
    
    it('should build query params with month/year context', () => {
      const parsedQuery: ParsedSearchQuery = {
        originalQuery: 'juli 2025 forklift',
        hasMonthFilter: true,
        hasYearFilter: true,
        month: 7,
        year: 2025,
        remainingQuery: 'forklift'
      };

      const result = SearchHelper.buildEnhancedQueryParams(parsedQuery);
      
      expect(result.searchQuery).toBe('forklift');
      expect(result.month).toBe(7);
      expect(result.year).toBe(2025);
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
    });

    it('should use defaults when no month/year in parsed query', () => {
      const parsedQuery: ParsedSearchQuery = {
        originalQuery: 'forklift',
        hasMonthFilter: false,
        hasYearFilter: false,
        remainingQuery: 'forklift'
      };

      const result = SearchHelper.buildEnhancedQueryParams(parsedQuery, 8, 2025);
      
      expect(result.searchQuery).toBe('forklift');
      expect(result.month).toBe(8);
      expect(result.year).toBe(2025);
    });

  });

  describe('generateContextualSuggestions', () => {
    
    it('should generate suggestions based on current month context', () => {
      const suggestions = SearchHelper.generateContextualSuggestions(7, 2025);
      
      expect(suggestions).toContain('juli 2025');
      expect(suggestions).toContain('juli');
      expect(suggestions).toContain('2025');
      expect(suggestions).toContain('juli 2024');
      expect(suggestions).toContain('juli 2026');
      expect(suggestions.length).toBe(5);
    });

  });

});
