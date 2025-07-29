const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://127.0.0.1:3000';
const LOGIN_CREDENTIALS = {
  identifier: 'superadmin4@example.com',
  password: 'Admin12345'
};

// Session storage
let sessionToken = '';

// Function to login and get session
async function login() {
  try {
    console.log('🔑 Attempting login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, LOGIN_CREDENTIALS, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Login response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data && response.data.data.accessToken) {
      sessionToken = response.data.data.accessToken;
      console.log('✅ Login successful');
      return true;
    } else {
      console.log('❌ Login failed - no token received');
      console.log('Response structure:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
    return false;
  }
}

// Function to get COT data with specific filters
async function getCotData(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `${API_BASE_URL}/cot/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log(`📡 Fetching COT data: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching COT data:', error.response?.data || error.message);
    return null;
  }
}

// Function to analyze COT data by month
function analyzeCotDataByMonth(data) {
  if (!data || !data.data) {
    console.log('❌ No data to analyze');
    return;
  }

  console.log('\n📊 COT DATA ANALYSIS BY MONTH');
  console.log('='.repeat(50));
  
  const monthlyData = {};
  
  data.data.forEach(cot => {
    const startDate = new Date(cot.startDate);
    const endDate = new Date(cot.endDate);
    
    const startMonth = startDate.getMonth() + 1;
    const startYear = startDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;
    const endYear = endDate.getFullYear();
    
    const startKey = `${startYear}-${startMonth.toString().padStart(2, '0')}`;
    const endKey = `${endYear}-${endMonth.toString().padStart(2, '0')}`;
    
    // Count by start month
    if (!monthlyData[startKey]) {
      monthlyData[startKey] = { starts: 0, ends: 0, total: new Set() };
    }
    monthlyData[startKey].starts++;
    monthlyData[startKey].total.add(cot.id);
    
    // Count by end month (if different from start)
    if (startKey !== endKey) {
      if (!monthlyData[endKey]) {
        monthlyData[endKey] = { starts: 0, ends: 0, total: new Set() };
      }
      monthlyData[endKey].ends++;
      monthlyData[endKey].total.add(cot.id);
    }
    
    console.log(`COT: ${cot.capability?.trainingName || 'Unknown'}`);
    console.log(`  ID: ${cot.id}`);
    console.log(`  Start: ${cot.startDate} (${startKey})`);
    console.log(`  End: ${cot.endDate} (${endKey})`);
    console.log('');
  });

  console.log('\n📈 MONTHLY SUMMARY:');
  console.log('Month\t\tStarts\tEnds\tTotal');
  console.log('-'.repeat(40));
  
  Object.keys(monthlyData).sort().forEach(month => {
    const data = monthlyData[month];
    console.log(`${month}\t\t${data.starts}\t${data.ends}\t${data.total.size}`);
  });
  
  return monthlyData;
}

// Function to test specific month filter
async function testMonthFilter(year, month) {
  console.log(`\n🧪 TESTING MONTH FILTER: ${month}/${year}`);
  console.log('='.repeat(50));
  
  // Calculate month boundaries
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const endDate = `${year}-${month.toString().padStart(2, '0')}-${daysInMonth.toString().padStart(2, '0')}`;
  
  console.log(`Date range: ${startDate} to ${endDate}`);
  
  // Test without date filter (get all data)
  const allData = await getCotData({
    page: 1,
    size: 50,
    sort_by: 'startDate',
    sort_order: 'asc'
  });
  
  if (allData) {
    console.log(`\n📊 ALL DATA (no date filter): ${allData.data?.length || 0} records`);
    
    // Filter client-side to see what should match
    const clientFiltered = allData.data?.filter(cot => {
      const cotStartDate = new Date(cot.startDate);
      const cotEndDate = new Date(cot.endDate);
      const targetMonthStart = new Date(startDate);
      const targetMonthEnd = new Date(endDate);
      
      const startsInMonth = cotStartDate >= targetMonthStart && cotStartDate <= targetMonthEnd;
      const endsInMonth = cotEndDate >= targetMonthStart && cotEndDate <= targetMonthEnd;
      
      return startsInMonth || endsInMonth;
    }) || [];
    
    console.log(`\n✅ CLIENT-SIDE FILTERED for ${month}/${year}: ${clientFiltered.length} records`);
    console.log('Matching COTs:');
    clientFiltered.forEach((cot, index) => {
      console.log(`  ${index + 1}. ${cot.capability?.trainingName || 'Unknown'} (${cot.startDate} - ${cot.endDate})`);
    });
    
    // Test with backend date filter
    console.log(`\n🔍 Testing backend filter with dates: ${startDate} to ${endDate}`);
    const backendFiltered = await getCotData({
      page: 1,
      size: 50,
      startDate: startDate,
      endDate: endDate,
      sort_by: 'startDate',
      sort_order: 'asc'
    });
    
    if (backendFiltered) {
      console.log(`📊 BACKEND FILTERED: ${backendFiltered.data?.length || 0} records`);
      console.log('Backend results:');
      backendFiltered.data?.forEach((cot, index) => {
        console.log(`  ${index + 1}. ${cot.capability?.trainingName || 'Unknown'} (${cot.startDate} - ${cot.endDate})`);
      });
    }
  }
}

// Main investigation function
async function main() {
  console.log('🔍 INVESTIGATING COT PAGINATION ISSUE');
  console.log('=' .repeat(50));
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Step 2: Test July 2025 (should have 18 records)
  await testMonthFilter(2025, 7);
  
  // Step 3: Test August 2025 (should have 2 records)  
  await testMonthFilter(2025, 8);
  
  console.log('\n🎯 INVESTIGATION COMPLETE');
}

// Run investigation
main().catch(console.error);
