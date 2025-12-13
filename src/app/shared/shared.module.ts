import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineBreaksPipe } from 'src/app/services/linebreaks.pipe';

@NgModule({
  declarations: [LineBreaksPipe],
  imports: [CommonModule],
  exports: [LineBreaksPipe] // ⭐ quan trọng
})
export class SharedModule {}
