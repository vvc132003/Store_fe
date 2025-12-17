import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-header-side',
  templateUrl: './card-header-side.component.html',
  styleUrls: ['./card-header-side.component.scss']
})
export class CardHeaderSideComponent implements OnChanges {
  @Input() project_list: any[] = [];
  @Input() oldSlug: string | null = null;

  constructor(private route: ActivatedRoute) { }

ngOnChanges(changes: SimpleChanges): void {
  if (!changes['oldSlug'] || !this.oldSlug) {
    return;
  }

  const slug_viewCount = this.project_list.find(p => p.slug === this.oldSlug);

  if (slug_viewCount) {
    slug_viewCount.viewCount += 1;
  }
}



}
