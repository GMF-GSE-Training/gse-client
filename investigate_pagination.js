const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      identifier: 'superadmin4@example.com',
      password: 'Admin12345'
    });
    
    console.log('✅ Login successful');
    return response.data.accessToken;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function investigatePagination() {
  try {
    const token = await login();
    
    // Parameter untuk Juli 2025
    const searchQuery = '';
    const startDate = '2025-07-01';
    const endDate = '2025-07-31';
    const sortBy = 'startDate';
    const sortOrder = 'asc';
    const size = 10;
    
    console.log('\n🔍 INVESTIGATING PAGINATION ISSUE FOR JULI 2025');
    console.log('===============================================');
    
    // Test multiple pages
    for (let page = 1; page <= 3; page++) {
      console.log(`\n📄 TESTING PAGE ${page}:`);
      console.log(`GET ${BASE_URL}/cot?q=${searchQuery}&page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      
      const response = await axios.get(`${BASE_URL}/cot`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          q: searchQuery,
          page: page,
          size: size,
          startDate: startDate,
          endDate: endDate,
          sortBy: sortBy,
          sortOrder: sortOrder
        }
      });
      
      const { data, paging, info } = response.data;
      
      console.log(`📊 Page ${page} Response:`, {
        recordsCount: data.length,
        paging: paging,
        info: info,
        firstRecord: data.length > 0 ? {
          id: data[0].id,
          trainingName: data[0].capability?.trainingName,
          startDate: data[0].startDate,
          endDate: data[0].endDate
        } : null,
        lastRecord: data.length > 0 ? {
          id: data[data.length - 1].id,
          trainingName: data[data.length - 1].capability?.trainingName,
          startDate: data[data.length - 1].startDate,
          endDate: data[data.length - 1].endDate
        } : null
      });
      
      // Analyze filtering logic
      console.log('\n🧪 FILTERING ANALYSIS:');
      const targetStart = new Date(startDate);
      const targetEnd = new Date(endDate);
      
      let correctFilterCount = 0;
      let incorrectFilterCount = 0;
      
      data.forEach((cot, index) => {
        const cotStart = new Date(cot.startDate);
        const cotEnd = new Date(cot.endDate);
        
        const startsInMonth = cotStart >= targetStart && cotStart <= targetEnd;
        const endsInMonth = cotEnd >= targetStart && cotEnd <= targetEnd;
        const shouldBeIncluded = startsInMonth || endsInMonth;
        
        if (shouldBeIncluded) {
          correctFilterCount++;
        } else {
          incorrectFilterCount++;
          console.log(`🚫 INCORRECT FILTER - COT ${cot.id}:`, {
            trainingName: cot.capability?.trainingName,
            startDate: cot.startDate,
            endDate: cot.endDate,
            startsInMonth,
            endsInMonth,
            reason: 'Should be filtered out by frontend logic'
          });
        }
        
        if (index < 3) { // Show first 3 for debugging
          console.log(`✅ COT ${index + 1}:`, {
            id: cot.id,
            trainingName: cot.capability?.trainingName,
            startDate: cot.startDate,
            endDate: cot.endDate,
            startsInMonth,
            endsInMonth,
            shouldBeIncluded,
            status: shouldBeIncluded ? 'CORRECT' : 'INCORRECT'
          });
        }
      });
      
      console.log(`\n📈 Page ${page} Filter Summary:`, {
        totalRecords: data.length,
        correctFilterCount,
        incorrectFilterCount,
        filterAccuracy: `${Math.round((correctFilterCount / data.length) * 100)}%`
      });
      
      // If no data, stop checking
      if (data.length === 0) {
        console.log(`\n⏹️ No more data on page ${page}, stopping investigation`);
        break;
      }
    }
    
    // Test without date filtering to see total available data
    console.log('\n\n🌐 TESTING WITHOUT DATE FILTER (to see total available data):');
    const noFilterResponse = await axios.get(`${BASE_URL}/cot`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        q: '',
        page: 1,
        size: 50, // Get more data
        sortBy: 'startDate',
        sortOrder: 'asc'
      }
    });
    
    console.log('📊 No Filter Response:', {
      totalRecords: noFilterResponse.data.data.length,
      paging: noFilterResponse.data.paging
    });
    
    // Show Juli 2025 related records from unfiltered data
    const juliRelated = noFilterResponse.data.data.filter(cot => {
      const cotStart = new Date(cot.startDate);
      const cotEnd = new Date(cot.endDate);
      const targetStart = new Date('2025-07-01');
      const targetEnd = new Date('2025-07-31');
      
      const startsInJuli = cotStart >= targetStart && cotStart <= targetEnd;
      const endsInJuli = cotEnd >= targetStart && cotEnd <= targetEnd;
      const overlapsJuli = cotStart <= targetEnd && cotEnd >= targetStart;
      
      return overlapsJuli; // Any overlap with Juli
    });
    
    console.log('\n🎯 JULI 2025 RELATED RECORDS FROM UNFILTERED DATA:', {
      totalFound: juliRelated.length,
      records: juliRelated.map((cot, index) => {
        const cotStart = new Date(cot.startDate);
        const cotEnd = new Date(cot.endDate);
        const targetStart = new Date('2025-07-01');
        const targetEnd = new Date('2025-07-31');
        
        return {
          index: index + 1,
          id: cot.id,
          trainingName: cot.capability?.trainingName,
          startDate: cot.startDate,
          endDate: cot.endDate,
          startsInJuli: cotStart >= targetStart && cotStart <= targetEnd,
          endsInJuli: cotEnd >= targetStart && cotEnd <= targetEnd,
          overlapsJuli: cotStart <= targetEnd && cotEnd >= targetStart
        };
      })
    });
    
  } catch (error) {
    console.error('❌ Investigation failed:', error.response?.data || error.message);
  }
}

investigatePagination();
