import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DisplayFilesComponent } from '../../../../shared/components/display-files/display-files.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CertificateService } from '../../../../shared/service/certificate.service';
import { finalize, map } from 'rxjs';

@Component({
  selector: 'app-displays-certificate-file',
  standalone: true,
  imports: [
    DisplayFilesComponent,
    CommonModule,
  ],
  templateUrl: './displays-certificate-file.component.html',
  styleUrl: './displays-certificate-file.component.css'
})
export class DisplaysCertificateFileComponent implements OnInit {
  pageTitle: string = 'View Certificate';
  id = this.route.snapshot.paramMap.get('certificateId');
  fileUrl: string | undefined;
  fileType: string = '';
  safeUrl: SafeResourceUrl | string = '';
  cachedUserProfile = localStorage.getItem('user_profile');
  isLoading: boolean = false;
  navigationLink: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly certificateService: CertificateService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Try to get state from current navigation first
    const navigation = this.router.getCurrentNavigation();
    let state = navigation?.extras.state;

    // If not available from current navigation, try from Location state (fallback)
    if (!state) {
      const locationState = this.location.getState() as any;
      if (locationState && locationState.data) {
        state = locationState;
      }
    }

    // Final fallback: try window.history.state
    if (!state && window.history.state && window.history.state.data) {
      state = window.history.state;
    }

    if(state && state['data']) {
      this.navigationLink = state['data'];
    } else {
      // Default fallback
      if(this.cachedUserProfile) {
        const userProfile = JSON.parse(this.cachedUserProfile);
        if(userProfile.role.name === 'user') {
          this.navigationLink = '/participants';
        } else {
          this.navigationLink = '/participants';
        }
      } else {
        this.navigationLink = '/participants';
      }
    }

    if (this.id) {
      this.getFile(this.id);
    }
  }

  getFile(id: string): void {
    this.isLoading = true;
    this.certificateService.viewFile(id).pipe(
      map(response => response.data),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (url: string) => {
        this.fileUrl = url;
        this.fileType = this.getMediaTypeFromUrl(url);
        
        // Use the URL directly since backend returns a URL
        if (this.fileType === 'application/pdf') {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${url}#toolbar=0`);
        } else {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onImageLoad() {
    this.isLoading = false;
  }

  onImageError() {
    console.log('Failed to load file:', this.safeUrl);
    this.isLoading = false;
  }

  downloadFile(): void {
    if (!this.fileUrl) {
      console.error('File URL is missing, cannot download.');
      return;
    }
    const link = document.createElement('a');
    link.href = this.fileUrl;
    link.download = `certificate${this.getDownloadExtension()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getMediaTypeFromUrl(url: string): string {
    const extension = url.toLowerCase().split('.').pop()?.split('?')[0];
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'bmp': return 'image/bmp';
      case 'webp': return 'image/webp';
      default: return 'application/pdf'; // Default to PDF
    }
  }

  getDownloadExtension(): string {
    const extension = this.fileUrl?.toLowerCase().split('.').pop()?.split('?')[0];
    return extension ? `.${extension}` : '.pdf';
  }
}

