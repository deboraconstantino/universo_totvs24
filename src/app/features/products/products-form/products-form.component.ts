import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PoBreadcrumb, PoDialogService, PoDynamicFormField, PoDynamicModule, PoLoadingModule, PoNotificationService, PoPageAction, PoPageModule } from '@po-ui/ng-components';
import { FieldsControlService } from '../../../shared/services/fields-control.service';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Products } from '../shared/interfaces/products';
import { ProductsService } from '../shared/services/products.service';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    CommonModule,
    PoDynamicModule,
    PoPageModule,
    ProtheusLibCoreModule,
    PoLoadingModule
  ],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.css'
})
export class ProductsFormComponent implements OnInit {
  fields: Array<PoDynamicFormField> = [];
  isLoading: boolean = true;
  productForm: NgForm = new NgForm([], []);
  isUpdate: boolean = false;
  value: Products = {
    b1_desc: '',
    b1_um: '',
    b1_tipo: '',
    b1_locpad: '',
    b1_cod: '',
  };
  breadcrumb: PoBreadcrumb = { items: [
    { label: 'Home', link: '/' },
    { label: 'Manutenção de Produtos' }
  ] };
  actions: Array<PoPageAction> = [
    { label: 'Salvar', action: this.saveProduct.bind(this), disabled: true },
    { label: 'Cancelar', action: this.confirmCancel.bind(this), disabled: true }
  ];

  constructor(
    private fieldsControlService: FieldsControlService,
    private poNotificationService: PoNotificationService,
    private poDialogService: PoDialogService,
    private router: Router,
    private productsService: ProductsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getFields();
    this.isUpdate = this.activatedRoute.snapshot.params['id'] !== undefined;
  }

  getFields(): void {
    this.fieldsControlService.getAliasStruct('SB1').subscribe({
      next: (fields: any) => {
        this.fields = this.convertFieldsToDynamicForm(fields['SB1'].fields);
        this.isLoading = false;
        this.actions[0].disabled = false;
        this.actions[1].disabled = false;
        this.updateLookupFields(this.fields);
        if (this.activatedRoute.snapshot.params['id']) {
          this.getValue(this.activatedRoute.snapshot.params['id']);
        }

        console.log(this.value, this.productForm, this.fields)
      },
      error: () => this.poNotificationService.error('Falha ao retornar campos para formulário.')
    })
  }

  convertFieldsToDynamicForm(fields: any): any {
    return fields.filter(
      (fields: any) => fields.required
    ).map((field: any) => (
      {...field, label: field.title, property: field.field.toLowerCase()})
    );
  }

  confirmCancel(): void {
    this.poDialogService.confirm({
      title: 'Confirmação',
      message: 'Tem certeza que deseja cancelar a operação? As informações preenchidas serão perdidas.',
      confirm: this.goToProductsList.bind(this)
    });
  }

  goToProductsList(): void {
    this.router.navigate(['']);
  }

  setForm(form: NgForm): void {
    this.productForm = form;
  }

  saveProduct(): void {
    this.actions[0].disabled = true;
    this.isUpdate ? this.putProduct(this.productForm.value) : this.postProduct(this.productForm.value);
  }

  postProduct(product: Products): void {
    this.productsService.post(product).subscribe({
      next: () => {
        this.actions[0].disabled = false;
        this.poNotificationService.success('Registro incluído com sucesso.');
        this.router.navigate(['']);
      },
      error: (error: any) => {
        this.actions[0].disabled = false;
        this.poNotificationService.error(`Falha ao salvar registro: ${error.error.errorMessage}`);
      }
    });
  }

  putProduct(product: Products): void {
    this.productsService.put(product.b1_cod, product).subscribe({
      next: () => {
        this.actions[0].disabled = false;
        this.poNotificationService.success('Registro alterado com sucesso.');
        this.router.navigate(['']);
      },
      error: (error: any) => {
        this.actions[0].disabled = false;
        this.poNotificationService.error(`Falha ao salvar registro: ${error.error.errorMessage}`);
      }
    });
  }

  updateLookupFields(fields: any): void {
    fields.forEach((field: any) => {
      if (field.field === 'B1_LOCPAD') {
        field.searchService = '/api/framework/v1/genericLookupService/smartui/NNR';
        field.fieldLabel = 'nnr_descri';
        field.fieldValue = 'nnr_codigo';
        field.columns = [{property: 'nnr_codigo', label: 'Código'}, {property: 'nnr_descri', label: 'Descrição'}]
      } else if (field.field === 'B1_TIPO') {
        field.searchService = '/api/framework/v1/genericLookupService/smartui/02';
        field.fieldLabel = 'x5_descri';
        field.fieldValue = 'x5_chave';
        field.columns = [{property: 'x5_chave', label: 'Tipo'}, {property: 'x5_descri', label: 'Descrição'}]
      } else if (field.field === 'B1_UM') {
        field.searchService = '/api/framework/v1/genericLookupService/smartui/SAH';
        field.fieldLabel = 'ah_descpo';
        field.fieldValue = 'ah_unimed';
        field.columns = [{property: 'ah_unimed', label: 'Unidade'}, {property: 'ah_descpo', label: 'Descrição'}]
      }
    });
  };

  getValue(productId: string): void {
    if (productId) {
      this.isLoading = true;
      this.productsService.getById(productId).subscribe({
        next: (product: Products) => { this.value = product; this.isLoading = false; },
        error: (error: any) => { this.isLoading = false; this.poNotificationService.error(error.error.errorMessage) }
      });
    }
  }
}
