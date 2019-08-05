import { Component, OnInit, Input } from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';
import {AppConfig} from '../../../app.config';
import {GenericHelpersService} from 'shared/services/generic-helpers.service';

@Component({
  selector: 'app-url-link',
  templateUrl: './url-link.component.html',
  providers: [GenericHelpersService]
})
export class UrlLinkComponent {
  @Input() url: string
}
