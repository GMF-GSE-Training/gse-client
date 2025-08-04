import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-icon-action',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
],
  templateUrl: './icon-action.component.html',
  styleUrl: './icon-action.component.css',
})
export class IconActionComponent {
  @Input() printLink?: string | { path: string; state: any };
  @Input() editLink?: string;
  @Input() detailLink?: string;
  @Input() delete?: () => any;
  @Input() showSelectIcon: boolean = false;
  @Input() select?: boolean | undefined = undefined;
  @Input() itemId?: number | string;
  @Input() state: { data: any; } = { data: '' };
  @Input() certificateState: any;

  @Output() selectChange = new EventEmitter<number | string>();

  toggleSelect() {
    if (this.showSelectIcon) {
      this.select = !this.select;
      this.selectChange.emit(this.itemId);
    }
  }

  getPrintLinkPath(): string {
    if (typeof this.printLink === 'string') {
      return this.printLink;
    } else if (this.printLink && typeof this.printLink === 'object') {
      return this.printLink.path;
    }
    return '';
  }

  getPrintLinkState(): any {
    if (typeof this.printLink === 'object' && this.printLink?.state) {
      return this.printLink.state;
    }
    return this.certificateState || this.state;
  }
}
