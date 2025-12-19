import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LineBreaksPipe } from 'src/app/services/linebreaks.pipe';
import { NotificationComponent } from './notification/notification.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { MessageNodeComponent } from './chat/message-tree/message-node/message-node.component';
import { MessageTreeComponent } from './chat/message-tree/message-tree.component';
import { LineCanvasComponent } from './charts/line-canvas/line-canvas.component';
import { BarCanvasComponent } from './charts/bar-canvas/bar-canvas.component';
import { MixedCanvasComponent } from './charts/mixed-canvas/mixed-canvas.component';
import { AreaCanvasComponent } from './charts/area-canvas/area-canvas.component';
import { DoughnutCanvasComponent } from './charts/doughnut-canvas/doughnut-canvas.component';
import { PolarAreaCanvasComponent } from './charts/polar-area-canvas/polar-area-canvas.component';
import { SessionWarningComponent } from './session-warning/session-warning.component';

@NgModule({
  declarations: [LineBreaksPipe, NotificationComponent,
    MessageTreeComponent, MessageNodeComponent, ChatComponent,
    LineCanvasComponent, BarCanvasComponent,
    MixedCanvasComponent, AreaCanvasComponent,
    DoughnutCanvasComponent, PolarAreaCanvasComponent,
    SessionWarningComponent],
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  exports: [LineBreaksPipe, NotificationComponent, ChatComponent, LineCanvasComponent, BarCanvasComponent, MixedCanvasComponent,
    AreaCanvasComponent,
    DoughnutCanvasComponent,
    PolarAreaCanvasComponent,
    SessionWarningComponent
  ] // ⭐ quan trọng
})
export class SharedModule { }
