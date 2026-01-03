import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, switchMap } from 'rxjs/operators'; // Added switchMap
import { ParticipantService } from '../../../shared/service/participant.service';
// Corrected import path for DisplayFilesComponent
import { DisplayFilesComponent } from '../../../shared/components/display-files/display-files.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-displays-participant-file',
  standalone: true,
  imports: [
    DisplayFilesComponent,
    CommonModule,
],
  templateUrl: './displays-participant-file.component.html',
  styleUrl: './displays-participant-file.component.css'
})
export class DisplaysParticipantFilesComponent implements OnInit {
  pageTitle: string = '';
  id = this.route.snapshot.paramMap.get('participantId');
  navigationLink: string = '';
  file: string | undefined;
  fileType: string = '';
  safeUrl: SafeResourceUrl | string = '';
  cachedUserProfile = localStorage.getItem('user_profile');
  isLoading: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly participantService: ParticipantService,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly renderer: Renderer2,
    private readonly el: ElementRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if(state) {
      this.navigationLink = state['data']
    } else {
      if(this.cachedUserProfile) {
        const userProfile = JSON.parse(this.cachedUserProfile);
        if(userProfile.role.name === 'user') {
          this.navigationLink = `/participants/${this.id}/profile/personal`;
        } else {
          this.navigationLink = `/participants/${this.id}/detail`;
        }
      }
    }
  }

  ngOnInit(): void {
    const path = this.router.url;
    const fileTypes = [
      'sim-a',
      'sim-b',
      'ktp',
      'surat-sehat-buta-warna',
      'surat-bebas-narkoba',
    ];

    const matchedType = fileTypes.find(type => path.includes(type));

    if (matchedType) {
      this.pageTitle = matchedType.toUpperCase().split('-').join(' ');
      if(this.id) {
        this.getFile(this.id, matchedType);
      }
    }
  }

  getFile(id: string, fileName: string): void {
    this.isLoading = true;
    this.participantService.getFile({ id }, fileName).pipe(
      switchMap(blob => { // Use switchMap to handle the async FileReader
        this.fileType = this.getMediaType(blob); // Determine file type from Blob
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob); // Reads the blob as a data URL (base64 encoded)
        });
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (dataUrl: string) => { // dataUrl is the base64 string with prefix e.g. data:image/png;base64,XYZ...
        this.file = dataUrl.split(',')[1]; // Extract base64 string without the data URL prefix
        if (this.fileType === 'application/pdf') {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${this.fileType};base64,${this.file}#toolbar=0`);
        } else {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${this.fileType};base64,${this.file}`);
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
    console.log('Failed to load image:', this.safeUrl);
    this.isLoading = false; // Hindari spinner terus tampil
  }

  // Modify getMediaType to accept Blob
  private getMediaType(blob: Blob): string {
    // Use Blob type to determine the file type
    if (blob.type === 'application/pdf') return 'application/pdf';
    if (blob.type === 'image/jpeg') return 'image/jpeg';
    if (blob.type === 'image/png') return 'image/png';
    if (blob.type === 'image/gif') return 'image/gif';
    if (blob.type === 'image/bmp') return 'image/bmp';
    if (blob.type === 'image/webp') return 'image/webp';
    return 'application/octet-stream'; // Fallback
  }

  getDownloadExtension(): string {
    switch (this.fileType) {
      case 'image/png': return '.png';
      case 'image/jpeg': return '.jpeg';
      case 'image/gif': return '.gif';
      case 'image/bmp': return '.bmp';
      case 'image/webp': return '.webp';
      case 'application/pdf': return '.pdf';
      default: return '';
    }
  }

  downloadFile(): void {
    if (!this.file || !this.fileType) {
      console.error('File content or type is missing, cannot download.');
      return;
    }
    const fileUrl = `data:${this.fileType};base64,${this.file}`;
    const link = this.renderer.createElement('a');
    this.renderer.setAttribute(link, 'href', fileUrl);
    this.renderer.setAttribute(link, 'download', `${(this.pageTitle || 'file').replace(/\s+/g, '_')}${this.getDownloadExtension()}`);
    this.renderer.appendChild(this.el.nativeElement, link);
    link.click();
    this.renderer.removeChild(this.el.nativeElement, link);
  }
}
