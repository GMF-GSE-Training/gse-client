import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmailFormComponent } from '../../components/email-form/email-form.component';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
  standalone: true,
  imports: [CommonModule, EmailFormComponent]
})
export class VerificationComponent implements OnInit {
  status: 'success' | 'failed' | null = null;
  data: any = {};

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const status = params['status'];
      if (status === 'success' || status === 'failed') {
        this.status = status;
      } else {
        this.status = null;
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToResend() {
    this.router.navigateByUrl('/auth/account-verification');
  }

  onSubmit(event: any) {
    // Optional: bisa diisi logic jika ingin handle submit form email di halaman ini
  }
} 