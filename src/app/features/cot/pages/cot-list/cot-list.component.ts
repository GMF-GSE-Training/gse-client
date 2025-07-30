import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManagementComponent } from "../../../../shared/components/data-management/data-management.component";
import { CotService } from '../../../../shared/service/cot.service';
import { Cot } from '../../../../shared/model/cot.model';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { HeaderComponent } from "../../../../components/header/header.component";
import { MonthInfo } from '../../../../shared/components/month-filter/month-filter.component';
import { CommonModule } from '@angular/common';
import { SearchHelper, ParsedSearchQuery } from '../../../../shared/utils/search-helper.util';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-cot-list',
  standalone: true,
  imports: [
    CommonModule,
    DataManagementComponent,
    HeaderComponent
],
  templateUrl: './cot-list.component.html',
  styleUrl: './cot-list.component.css',
})
export class CotListComponent implements OnInit, OnDestroy {
  columns = [
    { header: 'Mulai', field: 'startDate' },
    { header: 'Selesai', field: 'endDate' },
    { header: 'Kode Rating', field: 'ratingCode' },
    { header: 'Nama Training', field: 'trainingName' },
    { header: 'Action', field: 'action' },
  ];

  cot: any[] = [];
  isLoading: boolean = false;
  infoMessage: string | null = null;
  state: { data: string } = { data: '' };

  // 🔧 CRITICAL FIX: Add cache for all collected data
  private allCollectedData: any[] = [];
  private currentDataContext: string = '';
  
  // 🔧 FIX: Add destroy subject to handle component cleanup
  private destroy$ = new Subject<void>();

  // Komponen pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  dateFilter: {startDate: string, endDate: string} = {
    startDate: '',
    endDate: '',
  };

  startDate: string = '';
  endDate: string = '';

  dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric' // Pastikan nilai-nilai ini sesuai dengan spesifikasi Intl.DateTimeFormatOptions
  };

  // State sorting universal
  sortBy: string = 'startDate';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Month filter state
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  constructor(
    private readonly cotService: CotService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sweetalertService: SweetalertService,
  ) {}

  ngOnInit(): void {
    console.log('🚀 COT List Component Initialized');
    
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      console.log('📡 Query params received:', params);
      
      // Handle legacy 'keyword' parameter by converting to 'q'
      if (params['keyword'] && !params['q']) {
        console.log('🔄 Converting legacy keyword parameter...');
        this.router.navigate([], {
          queryParams: { 
            q: params['keyword'],
            keyword: null,
            page: params['page'] || 1,
            startDate: params['startDate'],
            endDate: params['endDate'],
            sort_by: params['sort_by'] || 'startDate',
            sort_order: params['sort_order'] || 'asc'
          },
          queryParamsHandling: 'merge',
        });
        return;
      }
      
      // PERBAIKAN: Auto-redirect jika tidak ada parameter filter bulan
      // Ini memastikan URL /cot selalu memiliki context filter bulan
      const hasMonthFilter = params['month'] && params['year'] && params['startDate'] && params['endDate'];
      
      console.log('🔍 Month filter check:', {
        hasMonthFilter,
        month: params['month'],
        year: params['year'],
        startDate: params['startDate'],
        endDate: params['endDate']
      });
      
      if (!hasMonthFilter) {
        console.log('🗺️ No month filter detected, applying current month fallback...');
        
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        // Calculate current month date range - TIMEZONE FIX
        const formattedStartDate = this.formatDateString(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const formattedEndDate = this.formatDateString(currentYear, currentMonth, daysInMonth);
        
        console.log('🗺️ FIXED - Month date calculation:', {
          currentMonth,
          currentYear,
          formattedStartDate,
          formattedEndDate,
          daysInMonth,
          note: 'Using correct month boundaries with timezone fix'
        });
        
        console.log('📅 Fallback date range calculated:', {
          currentMonth,
          currentYear,
          formattedStartDate,
          formattedEndDate
        });
        
        // Update component state before redirect
        this.selectedMonth = currentMonth;
        this.selectedYear = currentYear;
        this.startDate = formattedStartDate;
        this.endDate = formattedEndDate;
        
        console.log('🔄 Auto-redirected to current month:', {
          month: currentMonth,
          year: currentYear,
          dateRange: { startDate: formattedStartDate, endDate: formattedEndDate },
          reason: 'Fallback for URL without month filter'
        });
        
        // PERBAIKAN: Parse existing parameters before redirect to preserve page number
        const existingPage = parseInt(params['page'], 10) || 1;
        const existingQuery = params['q'] || null;
        const existingSortBy = params['sort_by'] || 'startDate';
        const existingSortOrder = params['sort_order'] || 'asc';
        
        console.log('🔧 Preserving existing URL parameters during month filter fallback:', {
          existingPage,
          existingQuery,
          sorting: { sortBy: existingSortBy, sortOrder: existingSortOrder },
          note: 'These will be maintained after adding month filter'
        });
        
        // Auto-redirect dengan parameter filter bulan saat ini + parameter yang sudah ada
        this.router.navigate([], {
          queryParams: {
            // PERBAIKAN: Pertahankan SEMUA parameter yang sudah ada
            q: existingQuery,
            page: existingPage, // Jangan reset ke 1, pertahankan page yang diminta user
            sort_by: existingSortBy,
            sort_order: existingSortOrder,
            // Tambahkan filter bulan saat ini
            month: currentMonth,
            year: currentYear,
            startDate: formattedStartDate,
            endDate: formattedEndDate
          },
          queryParamsHandling: 'merge',
        }).then(() => {
          // PERBAIKAN: Load data immediately after redirect dengan page yang benar
          console.log('✅ Redirect completed, loading data with preserved page number:', existingPage);
          
          // Update component state to match the preserved parameters
          this.currentPage = existingPage;
          this.searchQuery = existingQuery || '';
          this.sortBy = existingSortBy;
          this.sortOrder = existingSortOrder as 'asc' | 'desc';
          
          // Check if component is still alive before making HTTP request
          if (!this.destroy$.closed) {
            setTimeout(() => {
              // Double check if component is still alive after timeout
              if (!this.destroy$.closed) {
                this.getListCot(this.searchQuery, existingPage, this.itemsPerPage, formattedStartDate, formattedEndDate, existingSortBy, existingSortOrder);
              }
            }, 50);
          }
        });
        
        return; // Stop execution karena akan redirect
      }
      
      // Parameter sudah lengkap, lanjutkan proses normal
      this.searchQuery = params['q'] || '';
      this.currentPage = parseInt(params['page'], 10) || 1;
      this.startDate = params['startDate'] || '';
      this.endDate = params['endDate'] || '';
      this.sortBy = params['sort_by'] || 'startDate';
      this.sortOrder = params['sort_order'] || 'asc';
      
      // Handle month filter from URL
      this.selectedMonth = parseInt(params['month'], 10);
      this.selectedYear = parseInt(params['year'], 10);
      
      console.log('⚙️ Processing COT list with parameters:', {
        searchQuery: this.searchQuery,
        currentPage: this.currentPage,
        monthFilter: { month: this.selectedMonth, year: this.selectedYear },
        dateRange: { startDate: this.startDate, endDate: this.endDate },
        sorting: { sortBy: this.sortBy, sortOrder: this.sortOrder },
        allParams: params
      });
      
        // PERBAIKAN: Pastikan startDate dan endDate tidak kosong
        if (!this.startDate || !this.endDate) {
          console.warn('⚠️ Missing date range, calculating from month filter...');
          
          this.startDate = this.formatDateString(this.selectedYear, this.selectedMonth, 1);
          const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
          this.endDate = this.formatDateString(this.selectedYear, this.selectedMonth, daysInMonth);
          
          console.log('🔧 Recalculated date range:', {
            startDate: this.startDate,
            endDate: this.endDate,
            month: this.selectedMonth,
            year: this.selectedYear,
            daysInMonth,
            note: 'Fixed month boundaries calculation using consistent formatDateString'
          });
        }
      
      this.getListCot(this.searchQuery, this.currentPage, this.itemsPerPage, this.startDate, this.endDate, this.sortBy, this.sortOrder);
    });
  }

  // Utility function to format date strings correctly
  private formatDateString(year: number, month: number, day: number): string {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  getListCot(searchQuery: string, page: number, size: number, startDate: string, endDate: string, sortBy: string, sortOrder: string): void {
    this.isLoading = true;
    
    // 🔧 CRITICAL FIX: Check if we already have cached data for this context
    const currentContext = `${searchQuery}-${startDate}-${endDate}-${sortBy}-${sortOrder}`;
    const hasValidCache = this.allCollectedData.length > 0 && this.currentDataContext === currentContext;
    
    console.log('🚀 COT List Request:', {
      searchQuery,
      page,
      size,
      dateFilter: { startDate, endDate },
      sorting: { sortBy, sortOrder },
      monthContext: { month: this.selectedMonth, year: this.selectedYear },
      cacheStatus: {
        hasValidCache,
        cachedDataLength: this.allCollectedData.length,
        currentContext,
        previousContext: this.currentDataContext
      }
    });
    
    // 🔧 If we have valid cached data, use it for pagination
    if (hasValidCache) {
      console.log('📦 Using cached data for pagination:', {
        totalCachedData: this.allCollectedData.length,
        requestedPage: page,
        itemsPerPage: this.itemsPerPage,
        note: 'Skipping backend call, using frontend pagination on cached data'
      });
      
      this.paginateFromCache(page);
      return;
    }
    
    // 🔧 Clear cache and fetch fresh data
    this.allCollectedData = [];
    this.currentDataContext = currentContext;
    
    // 🧪 TESTING STRATEGY: Log expected filtering criteria
    console.log('🧪 TESTING - Expected Filtering Logic:', {
      strategy: 'START_OR_END_IN_MONTH',
      description: 'COT harus MULAI atau SELESAI di bulan target',
      targetMonth: this.selectedMonth,
      targetYear: this.selectedYear,
      dateRange: { start: startDate, end: endDate },
      expectedBehavior: {
        include: 'COT yang startDate atau endDate berada dalam rentang bulan',
        exclude: 'COT yang hanya melintasi bulan tanpa mulai/selesai di dalamnya'
      }
    });
    
    // PERBAIKAN: Kirim startDate dan endDate ke backend untuk filtering yang tepat
    // Backend dan frontend akan menggunakan logika filtering yang sama
    this.cotService.listCot(searchQuery, page, size, startDate, endDate, sortBy, sortOrder).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ data, actions, paging, info }) => {
        console.log('📊 CRITICAL DEBUG - Backend Response:', {
          totalRecords: data.length,
          info,
          paging: {
            currentPage: paging?.currentPage,
            totalPage: paging?.totalPage,
            size: paging?.size
          },
          rawData: data.slice(0, 2), // Show first 2 records for debugging
          allRecordIds: data.map(cot => ({ id: cot.id, start: cot.startDate, end: cot.endDate, name: cot.capability?.trainingName?.substring(0, 30) })),
          requestParams: {
            searchQuery,
            page,
            size,
            startDate,
            endDate,
            sortBy,
            sortOrder
          },
          currentContext: {
            selectedMonth: this.selectedMonth,
            selectedYear: this.selectedYear,
            currentPage: this.currentPage
          },
          IMPORTANT: 'If totalRecords is 0, backend returned no data for this request'
        });
        
        // 🔧 CRITICAL FIX: Apply correct month filtering logic on backend data
        // Berdasarkan hasil investigasi, backend terlalu permisif dan mengembalikan
        // COT yang hanya "melintasi" bulan tanpa benar-benar mulai/berakhir di bulan tersebut
        const targetMonthStart = new Date(startDate);
        const targetMonthEnd = new Date(endDate);
        
        const correctlyFilteredData = data.filter(cot => {
          const cotStartDate = new Date(cot.startDate);
          const cotEndDate = new Date(cot.endDate);
          
          // LOGIKA YANG BENAR: COT harus MULAI atau BERAKHIR di bulan target
          // BUKAN hanya melintasi bulan target
          const startsInTargetMonth = cotStartDate >= targetMonthStart && cotStartDate <= targetMonthEnd;
          const endsInTargetMonth = cotEndDate >= targetMonthStart && cotEndDate <= targetMonthEnd;
          const shouldBeIncluded = startsInTargetMonth || endsInTargetMonth;
          
          if (!shouldBeIncluded) {
            console.log('🚫 FILTERED OUT - COT hanya melintasi bulan tanpa start/end:', {
              cotId: cot.id,
              trainingName: cot.capability?.trainingName,
              startDate: cot.startDate,
              endDate: cot.endDate,
              targetMonth: `${this.selectedMonth}/${this.selectedYear}`,
              reason: 'COT tidak mulai atau berakhir di bulan target',
              startsInMonth: startsInTargetMonth,
              endsInMonth: endsInTargetMonth
            });
          }
          
          return shouldBeIncluded;
        });
        
        console.log('✅ FILTERING FIXED - Results:', {
          backendRecords: data.length,
          correctlyFiltered: correctlyFilteredData.length,
          filteredOut: data.length - correctlyFilteredData.length,
          targetMonth: `${this.selectedMonth}/${this.selectedYear}`,
          dateRange: { startDate, endDate },
          logic: 'COT must START or END in target month (not just span)',
          note: 'Backend data corrected with proper month filtering'
        });
        
        // Replace data dengan hasil filtering yang benar
        data = correctlyFilteredData;
        
        this.infoMessage = info || null;
        
        console.log('✅ Backend response received:', {
          originalCount: data.length,
          monthFilter: `${this.selectedMonth}/${this.selectedYear}`,
          backendPaging: paging,
          note: 'Data from backend - checking if adaptive fetching needed'
        });
        
        // PERBAIKAN KRITIKAL: Trust backend filtering but handle insufficient data
        // Backend sudah melakukan filtering yang benar, tapi mungkin perlu lebih banyak data untuk halaman ini
        
        const needsMoreData = data.length < this.itemsPerPage && paging && this.currentPage < paging.totalPage;
        
        if (needsMoreData) {
          console.log('🔄 Insufficient data on this page, fetching additional pages...', {
            currentDataLength: data.length,
            itemsPerPage: this.itemsPerPage,
            currentPage: this.currentPage,
            totalPages: paging.totalPage,
            reason: 'Backend filtering resulted in fewer items than expected per page'
          });
          
          this.fetchAdditionalData(data, actions, paging, info || null, searchQuery, page, size, startDate, endDate, sortBy, sortOrder);
          return; // Exit early, data will be handled by fetchAdditionalData
        }
        
        console.log('📄 PAGINATION - Processing backend data directly:', {
          totalBackendData: data.length,
          currentPage: this.currentPage,
          itemsPerPage: this.itemsPerPage,
          backendTotalPages: paging?.totalPage,
          note: 'Using backend data directly - sufficient data available'
        });
        
        // PERBAIKAN: Map data langsung dari backend (no additional filtering)
        this.cot = data.map((cot) => {
          const mappedCot = {
            startDate: new Date(cot.startDate).toLocaleDateString('id-ID', this.dateOptions),
            endDate: new Date(cot.endDate).toLocaleDateString('id-ID', this.dateOptions),
            ratingCode: cot.capability?.ratingCode,
            trainingName: cot.capability?.trainingName,
            capabilityLink: `/capability/${cot.capability.id}/curriculum-syllabus`,
            editLink: actions?.canEdit ? `/cot/${cot.id}/edit` : null,
            detailLink: actions?.canView ? `/cot/${cot.id}/detail` : null,
            deleteMethod: actions?.canDelete ? () => this.deleteCot(cot) : null,
          };
          
          console.log('🎯 Mapped COT item:', {
            original: {
              id: cot.id,
              startDate: cot.startDate,
              endDate: cot.endDate,
              trainingName: cot.capability?.trainingName
            },
            mapped: mappedCot
          });
          
          return mappedCot;
        });
        
        console.log('🎨 Final rendered data:', {
          totalItems: this.cot.length,
          backendTotalPages: paging?.totalPage,
          items: this.cot.map(item => ({
            startDate: item.startDate,
            trainingName: item.trainingName,
            ratingCode: item.ratingCode
          })),
          note: 'Data yang akan ditampilkan di table - langsung dari backend'
        });
        
        this.state.data = `/cot`;
        // PERBAIKAN: Trust backend pagination completely
        this.totalPages = paging?.totalPage || 1;
        this.isLoading = false;
        
        // DEBUGGING: Force change detection (only if component is still alive)
        console.log('🔄 Forcing change detection after data update');
        if (!this.destroy$.closed) {
          setTimeout(() => {
            // Check again after timeout
            if (!this.destroy$.closed) {
              console.log('⏰ After timeout - Final cot array:', {
                length: this.cot.length,
                isLoading: this.isLoading,
                data: this.cot.slice(0, 2)
              });
            }
          }, 100);
        }

      },
      error: (error) => {
        console.error('🔍 Error in getListCot:', error);
        this.isLoading = false;
        this.sweetalertService.alert('Pemberitahuan', 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  async deleteCot(cot: Cot): Promise<void> {
    const isConfirmed = await this.sweetalertService.confirm('Anda Yakin?', `Apakah anda ingin menghapus COT ${cot.capability.trainingName}?`, 'warning', 'Ya, hapus!');
    if (isConfirmed) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.cotService.deleteCot(cot.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.sweetalertService.alert('Dihapus!', 'Data COT berhasil dihapus', 'success');
          this.cot = this.cot.filter(c => c.id !== cot.id);

          if(this.cot.length === 0 && this.currentPage > 0) {
            this.currentPage -= 1;
          }

          this.getListCot(this.searchQuery, this.currentPage, this.itemsPerPage, this.startDate, this.endDate, this.sortBy, this.sortOrder);

          // Cek apakah halaman saat ini lebih besar dari total halaman
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages; // Pindah ke halaman sebelumnya
          }

          // Update query params dengan currentPage yang diperbarui
          const queryParams = this.searchQuery
            ? { q: this.searchQuery, page: this.currentPage }
            : { page: this.currentPage };

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge',
          });
        },
        error: (error) => {
          console.log(error);
          this.sweetalertService.alert('Gagal!', 'Terjadi kesalahan, coba lagi nanti', 'error');
        }
      });
    }
  }

  onSearchChanged(query: string): void {
    // Jika query kosong, bersihkan & kembali ke konteks bulan saat ini
    if (!query?.trim()) {
      this.router.navigate([], {
        queryParams: {
          q: null, // Hapus parameter q
          page: 1, // Kembali ke halaman 1
        },
        queryParamsHandling: 'merge',
      });
      return;
    }

    // 1. Parse search query untuk bulan dan tahun
    const parsedQuery = SearchHelper.parseSearchQuery(query);
    console.log('✅ [SEARCH] Parsed Query:', parsedQuery);

    // 2. Tentukan target bulan dan tahun
    // Jika search query mengandung bulan/tahun, gunakan itu. Jika tidak, gunakan month filter saat ini.
    const targetMonth = parsedQuery.month || this.selectedMonth;
    const targetYear = parsedQuery.year || this.selectedYear;

    // 3. Kalkulasi date range yang BENAR berdasarkan target
    const formattedStartDate = this.formatDateString(targetYear, targetMonth, 1);
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const formattedEndDate = this.formatDateString(targetYear, targetMonth, daysInMonth);

    // 4. Tentukan search query final (tanpa bulan/tahun)
    const finalSearchQuery = parsedQuery.remainingQuery.trim() || null;

    // 5. Buat object query parameter yang bersih
    const newQueryParams: any = {
      page: 1, // Selalu reset ke halaman 1 saat search baru
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      q: finalSearchQuery,
      month: targetMonth,
      year: targetYear,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    
    // Hapus key yang nilainya null/undefined agar tidak muncul di URL
    Object.keys(newQueryParams).forEach(key => {
      if (newQueryParams[key] === null || newQueryParams[key] === undefined) {
        delete newQueryParams[key];
      }
    });
    
    console.log('🚀 [SEARCH] Navigating with new params:', newQueryParams);

    // 6. Navigasi dengan parameter yang bersih (tanpa merge)
    this.router.navigate([], { queryParams: newQueryParams });
  }

  viewAll(): void {
    // Reset to current month when viewing all
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Calculate current month date range
    const formattedStartDate = this.formatDateString(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const formattedEndDate = this.formatDateString(currentYear, currentMonth, daysInMonth);
    
    // Update local state
    this.selectedMonth = currentMonth;
    this.selectedYear = currentYear;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        q: undefined, 
        page: undefined,
        // Reset to current month context
        month: currentMonth,
        year: currentYear,
        startDate: formattedStartDate, 
        endDate: formattedEndDate 
      },
      queryParamsHandling: 'merge',
    });
    this.searchQuery = '';
  }

  onPageChanged(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  toggleSort(col: string) {
    if (this.sortBy === col) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = col;
      this.sortOrder = 'asc';
    }
    
    // PERBAIKAN: Pertahankan semua query parameters yang ada, terutama filter bulan
    const currentParams = this.route.snapshot.queryParams;
    const preservedParams = {
      // Pertahankan parameter filter bulan jika ada
      month: currentParams['month'] || this.selectedMonth,
      year: currentParams['year'] || this.selectedYear,
      startDate: currentParams['startDate'],
      endDate: currentParams['endDate'],
      // Pertahankan parameter search jika ada
      q: currentParams['q'],
      // Update sorting parameters
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      page: 1 // Reset ke halaman pertama saat sorting
    };
    
    // Hapus parameter yang null/undefined
    const cleanParams = Object.fromEntries(
      Object.entries(preservedParams).filter(([key, value]) => value != null && value !== '')
    );
    
    console.log('🔄 Sorting with preserved parameters:', {
      column: col,
      newSortOrder: this.sortOrder,
      preservedParams: cleanParams,
      note: 'All filter parameters maintained during sorting'
    });
    
    this.router.navigate([], {
      queryParams: cleanParams,
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(event: { sortBy: string, sortOrder: 'asc' | 'desc' }) {
    this.toggleSort(event.sortBy);
  }

  // PERBAIKAN: Method untuk mengambil data tambahan ketika data tidak cukup
  private fetchAdditionalData(
    currentData: any[], 
    actions: any, 
    paging: any, 
    info: string | null,
    searchQuery: string, 
    currentPage: number, 
    size: number, 
    startDate: string, 
    endDate: string, 
    sortBy: string, 
    sortOrder: string
  ): void {
    let allData = [...currentData];
    let nextPage = currentPage + 1;
    
    // Track unique COT IDs to prevent duplication
    const existingIds = new Set(allData.map(cot => cot.id));
    
    console.log('🔄 Starting adaptive data fetching:', {
      currentData: allData.length,
      target: this.itemsPerPage,
      nextPage,
      totalPages: paging.totalPage,
      existingIds: Array.from(existingIds)
    });
    
    const fetchNextPage = () => {
      // Check if we have enough data or reached the last page
      const hasEnoughData = allData.length >= this.itemsPerPage;
      const reachedLastPage = nextPage > paging.totalPage;
      
      console.log('🔍 Adaptive fetch condition check:', {
        allDataLength: allData.length,
        itemsPerPage: this.itemsPerPage,
        hasEnoughData,
        nextPage,
        backendTotalPage: paging.totalPage,
        reachedLastPage,
        shouldStop: hasEnoughData || reachedLastPage
      });
      
      if (hasEnoughData || reachedLastPage) {
        console.log('⏹️ Stopping adaptive fetch:', {
          reason: hasEnoughData ? 'Enough data collected' : 'Reached last backend page',
          finalDataCount: allData.length,
          note: 'Proceeding to finalize data'
        });
        this.finalizeAdaptiveData(allData, actions, paging, info);
        return;
      }
      
      console.log(`📡 Fetching additional page ${nextPage}...`);
      
      // Fetch the next page
      this.cotService.listCot(searchQuery, nextPage, size, startDate, endDate, sortBy, sortOrder).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: ({ data }) => {
          console.log(`📊 Additional page ${nextPage} response:`, {
            totalRecords: data.length,
            page: nextPage
          });
          
          // 🔧 CONSISTENT FILTERING: Apply same month filtering logic as main response
          const targetMonthStart = new Date(startDate);
          const targetMonthEnd = new Date(endDate);
          
          // First apply correct month filtering to all additional data
          const monthFilteredData = data.filter(cot => {
            const cotStartDate = new Date(cot.startDate);
            const cotEndDate = new Date(cot.endDate);
            
            // SAME LOGIC: COT must START or END within target month (not just span)
            const startsInTargetMonth = cotStartDate >= targetMonthStart && cotStartDate <= targetMonthEnd;
            const endsInTargetMonth = cotEndDate >= targetMonthStart && cotEndDate <= targetMonthEnd;
            const shouldBeIncluded = startsInTargetMonth || endsInTargetMonth;
            
            if (!shouldBeIncluded) {
              console.log(`🚫 ADAPTIVE FILTER OUT - COT hanya melintasi bulan:`, {
                cotId: cot.id,
                trainingName: cot.capability?.trainingName,
                startDate: cot.startDate,
                endDate: cot.endDate,
                targetMonth: `${this.selectedMonth}/${this.selectedYear}`,
                reason: 'COT tidak mulai atau berakhir di bulan target'
              });
            }
            
            return shouldBeIncluded;
          });
          
          // Then filter out duplicates from the correctly filtered data
          const newData = monthFilteredData.filter(cot => {
            if (existingIds.has(cot.id)) {
              console.log(`🚫 Skipping duplicate COT ID: ${cot.id}`);
              return false;
            }
            
            // Add to existing IDs set
            existingIds.add(cot.id);
            console.log(`✅ Including COT from adaptive fetch:`, {
              cotId: cot.id,
              trainingName: cot.capability?.trainingName
            });
            
            return true;
          });
          
          console.log(`✅ Additional page ${nextPage} processed with month filtering:`, {
            originalCount: data.length,
            newDataCount: newData.length,
            duplicatesSkipped: data.filter(cot => existingIds.has(cot.id)).length,
            monthFilteredOut: data.length - newData.length - data.filter(cot => existingIds.has(cot.id)).length,
            accumulated: allData.length + newData.length,
            uniqueIds: existingIds.size
          });
          
          // Add new data (already filtered for month relevance)
          allData.push(...newData);
          nextPage++;
          
          // Continue fetching if needed (but only if component is still alive)
          if (!this.destroy$.closed) {
            setTimeout(fetchNextPage, 50);
          }
        },
        error: (error) => {
          console.error(`❌ Error fetching additional page ${nextPage}:`, error);
          // Use whatever data we have
          this.finalizeAdaptiveData(allData, actions, paging, info);
        }
      });
    };
    
    fetchNextPage();
  }
  
  // 🔧 CRITICAL FIX: Method to paginate from cached data
  private paginateFromCache(page: number): void {
    console.log('📦 Paginating from cached data:', {
      totalCachedData: this.allCollectedData.length,
      requestedPage: page,
      itemsPerPage: this.itemsPerPage,
      note: 'Using frontend pagination on cached data'
    });
    
    // Calculate pagination boundaries
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Slice data for current page
    const pageData = this.allCollectedData.slice(startIndex, endIndex);
    
    console.log('✂️ CACHE PAGINATION SLICE:', {
      totalCachedData: this.allCollectedData.length,
      startIndex,
      endIndex,
      pageDataLength: pageData.length,
      currentPage: page,
      expectedLength: Math.min(this.itemsPerPage, this.allCollectedData.length - startIndex)
    });
    
    // Map the paginated data
    this.cot = pageData.map((cot) => {
      return {
        startDate: new Date(cot.startDate).toLocaleDateString('id-ID', this.dateOptions),
        endDate: new Date(cot.endDate).toLocaleDateString('id-ID', this.dateOptions),
        ratingCode: cot.capability?.ratingCode,
        trainingName: cot.capability?.trainingName,
        capabilityLink: `/capability/${cot.capability.id}/curriculum-syllabus`,
        editLink: cot.actions?.canEdit ? `/cot/${cot.id}/edit` : null,
        detailLink: cot.actions?.canView ? `/cot/${cot.id}/detail` : null,
        deleteMethod: cot.actions?.canDelete ? () => this.deleteCot(cot) : null,
      };
    });
    
    // Update pagination info
    this.totalPages = Math.ceil(this.allCollectedData.length / this.itemsPerPage);
    this.currentPage = page;
    this.isLoading = false;
    
    console.log('🎨 CACHE PAGINATION RESULT:', {
      displayedItems: this.cot.length,
      totalPages: this.totalPages,
      currentPage: this.currentPage,
      cacheSize: this.allCollectedData.length,
      note: 'Frontend pagination from cache completed'
    });
  }
  
  private finalizeAdaptiveData(allData: any[], actions: any, paging: any, info: string | null): void {
    console.log('🎯 Finalizing adaptive data result:', {
      totalData: allData.length,
      target: this.itemsPerPage,
      currentPage: this.currentPage,
      success: allData.length >= this.itemsPerPage || paging.currentPage >= paging.totalPage
    });
    
    // 🔧 CRITICAL FIX: Implement proper frontend pagination
    // Calculate pagination boundaries for current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    console.log('📄 PAGINATION BOUNDARIES:', {
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      startIndex,
      endIndex,
      totalAvailableData: allData.length,
      note: 'Slicing data based on current page'
    });
    
    // Slice data based on current page (CRITICAL FIX)
    const pageData = allData.slice(startIndex, endIndex);
    
    console.log('✂️ PAGINATION SLICE RESULT:', {
      originalDataLength: allData.length,
      slicedDataLength: pageData.length,
      expectedLength: Math.min(this.itemsPerPage, allData.length - startIndex),
      startIndex,
      endIndex,
      currentPage: this.currentPage,
      demonstration: {
        allDataItems: allData.slice(0, 3).map(cot => ({
          id: cot.id,
          training: cot.capability?.trainingName
        })),
        pageDataItems: pageData.slice(0, 3).map(cot => ({
          id: cot.id,
          training: cot.capability?.trainingName
        }))
      }
    });
    
    // Map ONLY the paginated data (CRITICAL FIX)
    this.cot = pageData.map((cot) => {
      const mappedCot = {
        startDate: new Date(cot.startDate).toLocaleDateString('id-ID', this.dateOptions),
        endDate: new Date(cot.endDate).toLocaleDateString('id-ID', this.dateOptions),
        ratingCode: cot.capability?.ratingCode,
        trainingName: cot.capability?.trainingName,
        capabilityLink: `/capability/${cot.capability.id}/curriculum-syllabus`,
        editLink: actions?.canEdit ? `/cot/${cot.id}/edit` : null,
        detailLink: actions?.canView ? `/cot/${cot.id}/detail` : null,
        deleteMethod: actions?.canDelete ? () => this.deleteCot(cot) : null,
      };
      
      console.log('🎯 Mapped COT item (paginated):', {
        original: {
          id: cot.id,
          startDate: cot.startDate,
          endDate: cot.endDate,
          trainingName: cot.capability?.trainingName
        },
        mapped: mappedCot
      });
      
      return mappedCot;
    });
    
    this.infoMessage = info || null;
    this.state.data = `/cot`;
    
    // 🔧 CRITICAL FIX: Cache all collected data for future pagination
    this.allCollectedData = [...allData];
    
    // 🔧 CRITICAL FIX: Calculate total pages based on ALL collected data
    this.totalPages = Math.ceil(allData.length / this.itemsPerPage);
    this.isLoading = false;
    
    console.log('🎨 FIXED - Final paginated result:', {
      displayedItems: this.cot.length,
      totalDataCollected: allData.length,
      calculatedTotalPages: this.totalPages,
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      isLoading: this.isLoading,
      paginationCheck: {
        expectedMaxItems: this.itemsPerPage,
        actualDisplayedItems: this.cot.length,
        isCorrect: this.cot.length <= this.itemsPerPage
      },
      note: 'Frontend pagination implemented correctly'
    });
  }

  onMonthChanged(monthInfo: MonthInfo): void {
    this.selectedMonth = monthInfo.value;
    this.selectedYear = monthInfo.year;
    
    // PERBAIKAN KRITIKAL: Gunakan batas bulan yang BENAR dengan timezone fix
    // monthInfo.value adalah 1-12, jadi untuk bulan ke-N:
    // Start: tahun, bulan-1, hari ke-1
    // End: tahun, bulan, hari ke-0 (hari terakhir bulan sebelumnya)
    
    // Format langsung tanpa timezone conversion untuk menghindari offset
    const formattedStartDate = this.formatDateString(monthInfo.year, monthInfo.value, 1);
    const daysInMonth = new Date(monthInfo.year, monthInfo.value, 0).getDate();
    const formattedEndDate = this.formatDateString(monthInfo.year, monthInfo.value, daysInMonth);
    
    console.log('🗺️ FIXED - Month Filter Changed:', {
      month: monthInfo.value,
      year: monthInfo.year,
      monthName: monthInfo.name,
      filterRange: { start: formattedStartDate, end: formattedEndDate },
      note: `Filtering COT untuk ${monthInfo.name} ${monthInfo.year} dengan batas yang BENAR`,
      expectedURLRange: `startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      prevBuggyRange: `startDate=2025-07-31&endDate=2025-08-30 (SALAH!)`,
      correctRange: `startDate=${formattedStartDate}&endDate=${formattedEndDate} (BENAR!)`,
      daysInMonth
    });
    
    // Update URL with month filter
    this.router.navigate([], {
      queryParams: {
        month: monthInfo.value,
        year: monthInfo.year,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        page: 1, // Reset to first page when month changes
        q: this.searchQuery || null,
        sort_by: this.sortBy,
        sort_order: this.sortOrder
      },
      queryParamsHandling: 'merge',
    });
  }
  
  ngOnDestroy(): void {
    console.log('🔄 COT List Component destroyed, cleaning up subscriptions');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
