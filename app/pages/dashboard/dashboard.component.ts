import { Component } from '@angular/core';
import { RealisasiCotChartComponent } from '../../components/chart/realisasi-cot-chart/realisasi-cot-chart.component';
import { DataPemegangKompetensiGseOperatorComponent } from '../../components/chart/data-pemegang-kompetensi-gse-operator/data-pemegang-kompetensi-gse-operator.component';
import { DataTotalSertifikatAktifComponent } from '../../components/chart/data-total-sertifikat-aktif/data-total-sertifikat-aktif.component';
import { DataJumlahPemegangSertifikatComponent } from '../../components/chart/data-jumlah-pemegang-sertifikat/data-jumlah-pemegang-sertifikat.component';
import { TableComponent } from "../../components/table/table.component";
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RealisasiCotChartComponent,
    DataPemegangKompetensiGseOperatorComponent,
    DataTotalSertifikatAktifComponent,
    DataJumlahPemegangSertifikatComponent,
    TableComponent,
    HeaderComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  columns = [
    { header: 'Nama Training', field: 'namaTraining' },
    { header: 'Mulai', field: 'mulai' },
    { header: 'Selesai', field: 'selesai' },
    { header: 'Kode Rating', field: 'kodeRating' },
    { header: 'Jumlah Peserta', field: 'jumlahPeserta' },
    { header: 'Lokasi Training', field: 'lokasiTraining' },
  ];

  data = [
    { kodeRating: 'BTT', namaTraining: 'Baggage Towing Tractor', },
    { kodeRating: 'FLT', namaTraining: 'Forklift', },
    { kodeRating: 'RDS', namaTraining: 'Refueling Defueling System', },
    { kodeRating: 'GPS', namaTraining: 'Ground Power System', },
    { kodeRating: 'ACS', namaTraining: 'Air Conditioning System', },
    { kodeRating: 'ATT', namaTraining: 'Aircraft Towing Tractor', },
    { kodeRating: 'LSS', namaTraining: 'Lavatory Service System', },
    { kodeRating: 'WSS', namaTraining: 'Water Service System', },
    { kodeRating: 'ASS', namaTraining: 'Air Starter System', },
    { kodeRating: 'MUV', namaTraining: 'Maintenance Unit Vehicle', },
    { kodeRating: 'BTT', namaTraining: 'Baggage Towing Tractor', },
    { kodeRating: 'FLT', namaTraining: 'Forklift', },
    { kodeRating: 'RDS', namaTraining: 'Refueling Defueling System', },
    { kodeRating: 'GPS', namaTraining: 'Ground Power System', },
    { kodeRating: 'ACS', namaTraining: 'Air Conditioning System', },
    { kodeRating: 'ATT', namaTraining: 'Aircraft Towing Tractor', },
    { kodeRating: 'LSS', namaTraining: 'Lavatory Service System', },
    { kodeRating: 'WSS', namaTraining: 'Water Service System', },
    { kodeRating: 'ASS', namaTraining: 'Air Starter System', },
    { kodeRating: 'MUV', namaTraining: 'Maintenance Unit Vehicle', },
    { kodeRating: 'BTT', namaTraining: 'Baggage Towing Tractor', },
    { kodeRating: 'FLT', namaTraining: 'Forklift', },
    { kodeRating: 'RDS', namaTraining: 'Refueling Defueling System', },
    { kodeRating: 'GPS', namaTraining: 'Ground Power System', },
    { kodeRating: 'ACS', namaTraining: 'Air Conditioning System', },
    { kodeRating: 'ATT', namaTraining: 'Aircraft Towing Tractor', },
    { kodeRating: 'LSS', namaTraining: 'Lavatory Service System', },
    { kodeRating: 'WSS', namaTraining: 'Water Service System', },
    { kodeRating: 'ASS', namaTraining: 'Air Starter System', },
    { kodeRating: 'MUV', namaTraining: 'Maintenance Unit Vehicle', },
    { kodeRating: 'BTT', namaTraining: 'Baggage Towing Tractor', },
    { kodeRating: 'FLT', namaTraining: 'Forklift', },
    { kodeRating: 'RDS', namaTraining: 'Refueling Defueling System', },
    { kodeRating: 'GPS', namaTraining: 'Ground Power System', },
    { kodeRating: 'ACS', namaTraining: 'Air Conditioning System', },
    { kodeRating: 'ATT', namaTraining: 'Aircraft Towing Tractor', },
    { kodeRating: 'LSS', namaTraining: 'Lavatory Service System', },
    { kodeRating: 'WSS', namaTraining: 'Water Service System', },
    { kodeRating: 'ASS', namaTraining: 'Air Starter System', },
    { kodeRating: 'MUV', namaTraining: 'Maintenance Unit Vehicle', }
  ];

  currentPage = 1;
  itemsPerPage = 6;

  constructor(private readonly router: Router) { }

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.data.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }
}
