import { BaseDestroyableDirective } from 'src/app/common/abstract/base-destroyable';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { MESSAGE } from 'src/app/common/data/message';
import { LoadingOnElementDirective } from 'src/app/common/directive/loading-on-element.directive';
import { IFields } from 'src/app/modules/declare-enterprises/abstract/enterprises.interface';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-list-emission-field-report',
  templateUrl: './list-emission-field-report.component.html',
  styleUrls: ['./list-emission-field-report.component.scss'],
})
export class ListEmissionFieldReportComponent extends BaseDestroyableDirective implements OnInit {
  @ViewChild('table', { static: true }) private elementTable: LoadingOnElementDirective;
  @Output() public toEditPageEmitter = new EventEmitter<number>();
  public fields: IFields[];

  constructor(private reportService: ReportService, private toastr: ToastrService) {
    super();
  }

  public ngOnInit(): void {
    this.getListFields();
  }

  public redirectToEditPage(fieldId: number): void {
    this.toEditPageEmitter.emit(fieldId);
  }

  public trackByFn(index: number, item: any): number {
    return item.id;
  }

  public getListFields() {
    this.elementTable.showLoadingCenter();
    this.reportService
      .getListFields()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.fields = res;
          this.elementTable.hideLoadingCenter();
        },
        () => {
          this.toastr.error(MESSAGE.ERROR, MESSAGE.NOTIFICATION);
          this.elementTable.hideLoadingCenter();
        }
      );
  }
}
