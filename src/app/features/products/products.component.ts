import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { PoPageDynamicTableActions, PoPageDynamicTableCustomTableAction, PoPageDynamicTableFilters, PoPageDynamicTableModule } from '@po-ui/ng-templates';
import { Products } from './shared/interfaces/products';
import { ProductsService } from './shared/services/products.service';
import { PoDialogService, PoLoadingModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageModule } from '@po-ui/ng-components';
import { ProJsToAdvplService } from '@totvs/protheus-lib-core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from '../../shared/interceptors/auth.interceptor';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    PoPageDynamicTableModule,
    PoModalModule,
    PoLoadingModule,
    PoPageModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true }
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  @ViewChild('balanceModal') balanceModal?: PoModalComponent;
  balance: number = 0;
  minhaApi: string = '/api/universototvs/v1/products';
  isLoadingBalance: boolean = false;
  readonly fields: Array<PoPageDynamicTableFilters> = [
    { property: 'b1_cod', key: true, label: 'Código' },
    { property: 'b1_filial', label: 'Filial' },
    { property: 'b1_desc', label: 'Descrição' },
    { property: 'b1_tipo', label: 'Tipo' },
    { property: 'b1_um', label: 'Unidade' },
    { property: 'b1_locpad', label: 'Armazém' }
  ];

  readonly actions: PoPageDynamicTableActions	= {new: 'new', edit: 'product/:id', remove: true};
  tableCustomActions: Array<PoPageDynamicTableCustomTableAction> = [
    {
      label: 'Consultar saldo',
      action: (row: Products) => this.alertCheckBalance(row.b1_cod)
    }
  ];

  constructor(
    private productsService: ProductsService,
    private poNotificationService: PoNotificationService,
    private poDialogService: PoDialogService,
    private proJsToAdvplService: ProJsToAdvplService
  ) {}

  alertCheckBalance(productId: string): void {
    if (this.proJsToAdvplService.protheusConnected()) {
      this.openBalanceModal(productId);
    } else {
      this.poDialogService.alert({
        title: 'Atenção',
        message: 'Não é possível consultar o saldo do produto, pois o aplicativo não está sendo executado pelo Protheus. Para prosseguir, abra o aplicativo pelo Protheus.'
      });
    };
  }

  openBalanceModal(productId: string): void {
    this.productsService.getParam('MV_TPSALDO');
    this.balanceModal?.open();
    this.checkBalance(productId);
  }

  checkBalance(productId: string): void {
    this.isLoadingBalance = true;
    this.productsService.checkBalance(productId).subscribe({
      next: (balance: number) => { this.balance = balance; this.isLoadingBalance = false; },
      error: () => { this.isLoadingBalance = false; this.poNotificationService.error('Falha ao consultar saldo do produto') }
    });
  }
}
