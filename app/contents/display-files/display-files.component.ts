import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TitleComponent } from "../../components/title/title.component";
import { HeaderComponent } from "../../components/header/header.component";
import { RouterLink } from '@angular/router';
import { LoaderComponent } from "../../components/loader/loader.component";
import { WhiteButtonComponent } from "../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../components/button/blue-button/blue-button.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-files',
  standalone: true,
  imports: [
    TitleComponent,
    HeaderComponent,
    RouterLink,
    LoaderComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    CommonModule,
],
  templateUrl: './display-files.component.html',
  styleUrl: './display-files.component.css'
})
export class DisplayFilesComponent {
  @Input() pageTitle: string = '';
  @Input() navigationLinks: string = '';
  @Input() isLoading: boolean = false;

  @Output() downloadChange = new EventEmitter<void>();

  onDownloadChanged() {
    this.downloadChange.emit();
  }
}
