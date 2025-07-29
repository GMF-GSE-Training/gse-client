# COT LIST TESTING GUIDE & TROUBLESHOOTING

## 🧪 TESTING CHECKLIST

### **1. Test Navigasi dari Sidebar**
- [ ] Buka aplikasi di `http://localhost:4201/`
- [ ] Login dengan user yang memiliki akses COT
- [ ] Klik menu COT di sidebar
- [ ] **Expected**: Auto-redirect ke URL dengan parameter bulan saat ini
- [ ] **Expected**: Data COT untuk bulan Juli 2025 muncul

### **2. Test Auto-Redirect Fallback**
- [ ] Akses langsung `http://localhost:4201/cot`
- [ ] **Expected**: URL berubah menjadi seperti ini:
  ```
  http://localhost:4201/cot?page=1&sort_by=startDate&sort_order=asc&month=7&year=2025&startDate=2025-06-30&endDate=2025-07-30
  ```
- [ ] **Expected**: Data muncul sesuai filter bulan

### **3. Test Sorting dengan Filter Persistence**
- [ ] Set filter bulan (Juli 2025)
- [ ] Klik header "Mulai" untuk sorting
- [ ] **Expected**: URL tetap memiliki parameter `month=7&year=2025&startDate=...&endDate=...`
- [ ] **Expected**: Data tetap terfilter Juli 2025 setelah sorting

### **4. Test Month Filter Navigation**
- [ ] Gunakan tombol `<` atau `>` di month filter
- [ ] Pindah ke bulan Agustus 2025
- [ ] **Expected**: URL berubah dengan parameter bulan Agustus
- [ ] **Expected**: Data berubah sesuai filter bulan Agustus

## 🔍 DEBUGGING LOGS

Saat testing, perhatikan log berikut di browser console:

### **Log yang Baik (Success)**
```javascript
🚀 COT List Component Initialized
📡 Query params received: {page: "1", sort_by: "startDate", sort_order: "asc", month: "7", year: "2025", startDate: "2025-06-30", endDate: "2025-07-30"}
⚙️ Processing COT list with parameters: {...}
🚀 COT List Request: {...}
📊 Backend Response: {totalRecords: 10, ...}
✅ Client-side filtering result: {originalCount: 10, filteredCount: 8, ...}
🎯 Mapped COT item: {...}
🎨 Final rendered data: {totalItems: 8, items: [...]}
```

### **Log yang Bermasalah (Need Investigation)**
```javascript
🗺️ No month filter detected, applying current month fallback...
🔄 Auto-redirected to current month: {...}
📊 Backend Response: {totalRecords: 10, ...}
✅ Client-side filtering result: {originalCount: 10, filteredCount: 0, ...}
🎨 Final rendered data: {totalItems: 0, items: []}
```

## 🐛 TROUBLESHOOTING

### **Masalah 1: Data Tidak Muncul Setelah Redirect**
**Symptoms**: URL redirect bekerja tapi data kosong

**Debug Steps**:
1. Cek console log untuk "Final rendered data"
2. Pastikan `filteredCount` > 0
3. Periksa apakah client-side filtering terlalu ketat

**Solution**:
```typescript
// Cek date range calculation
const targetMonthStart = new Date(startDate);
const targetMonthEnd = new Date(endDate);
console.log('Date range:', { targetMonthStart, targetMonthEnd });
```

### **Masalah 2: Sorting Menghilangkan Filter**
**Symptoms**: Setelah sorting, parameter month/year hilang dari URL

**Debug Steps**:
1. Cek log "Sorting with preserved parameters"
2. Pastikan `currentParams['month']` dan `currentParams['year']` ada

**Solution**: Sudah diperbaiki dengan parameter preservation di `toggleSort()`

### **Masalah 3: Month Filter Display Tidak Sync**
**Symptoms**: Month filter menunjukkan bulan yang berbeda dari data

**Debug Steps**:
1. Cek `this.selectedMonth` dan `this.selectedYear`
2. Pastikan nilai dari URL parameter ter-parse dengan benar

**Solution**:
```typescript
this.selectedMonth = parseInt(params['month'], 10);
this.selectedYear = parseInt(params['year'], 10);
```

## 📊 EXPECTED URL PATTERNS

### **Navigation dari Sidebar**
```
Before: /cot
After:  /cot?page=1&sort_by=startDate&sort_order=asc&month=7&year=2025&startDate=2025-06-30&endDate=2025-07-30
```

### **Setelah Sorting**
```
Before: /cot?page=1&sort_by=startDate&sort_order=asc&month=7&year=2025&startDate=2025-06-30&endDate=2025-07-30
After:  /cot?page=1&sort_by=endDate&sort_order=desc&month=7&year=2025&startDate=2025-06-30&endDate=2025-07-30
```

### **Setelah Pindah Bulan**
```
Before: /cot?page=1&sort_by=startDate&sort_order=asc&month=7&year=2025&startDate=2025-06-30&endDate=2025-07-30
After:  /cot?page=1&sort_by=startDate&sort_order=asc&month=8&year=2025&startDate=2025-07-31&endDate=2025-08-30
```

## ⚡ PERFORMANCE TESTING

### **Network Requests**
- [ ] Satu request API saat load pertama
- [ ] Satu request API saat ganti bulan
- [ ] Tidak ada request tambahan saat sorting (client-side)

### **Console Performance**
- [ ] Tidak ada error di console
- [ ] Log informatif tanpa spam
- [ ] Smooth navigation tanpa lag

## 🔧 BEST PRACTICES IMPLEMENTED

### **1. Modern Angular Patterns**
- ✅ Standalone components
- ✅ Reactive query parameter handling
- ✅ Proper error handling
- ✅ Enhanced logging for debugging

### **2. User Experience**
- ✅ Consistent URL patterns
- ✅ Persistent filter state
- ✅ Smooth navigation
- ✅ Proper loading states

### **3. Data Management**
- ✅ Client-side filtering as backup
- ✅ Optimized API calls
- ✅ Proper date handling
- ✅ Query parameter cleanup

## 🚀 NEXT STEPS

1. **Manual Testing**: Jalankan semua test cases di atas
2. **Backend Coordination**: Diskusi optimasi native month filtering
3. **Performance Monitoring**: Monitor dalam environment production
4. **User Feedback**: Collect feedback dari end users

---

**Status**: ✅ READY FOR TESTING
**Last Updated**: 2025-07-29
**Tested On**: Development Environment (localhost:4201)
