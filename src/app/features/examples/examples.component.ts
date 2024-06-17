import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoBreadcrumb, PoComboOption, PoModule, PoNotificationService } from '@po-ui/ng-components';
import { ProBranch, ProBranchList, ProBranchService, ProCompany, ProCompanyList, ProCompanyService, ProUserAccessInterface, ProUserAccessService } from '@totvs/protheus-lib-core';

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [
    CommonModule,
    PoModule,
    FormsModule
  ],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.css'
})
export class ExamplesComponent {
  branches: ProBranchList = {};
  isLoading: boolean = true;
  companies: ProCompanyList = {
    items: [],
    hasNext: false
  };
  branchesOptions: Array<PoComboOption> = [];
  companiesOptions: Array<PoComboOption> = [];
  routine: string = '';
  action: number = 0;
  alias: string = '';
  breadcrumb: PoBreadcrumb = { items: [
    { label: 'Home', link: '/' },
    { label: 'Exemplos com o protheus-lib-core' }
  ] };

  constructor(
    private proBranchService: ProBranchService,
    private poNotificationService: PoNotificationService,
    private proCompanyService: ProCompanyService,
    private proUserAccessService: ProUserAccessService
  ) { }

  ngOnInit(): void {
  }

  getBranches(): void {
    this.isLoading = true;
    this.proBranchService.getUserBranches().subscribe({
      next: (branches: ProBranchList) => {
        this.isLoading = false;
        this.branches = branches;
        this.branchesOptions = this.convertBranchesToPoComboOptions(branches.items!);
      },
      error: () => { this.isLoading = false; this.poNotificationService.error('Não foi possível retornar as filiais do usuário.') }
    });
  }

  getCompanies(): void {
    this.isLoading = true;
    this.proCompanyService.getUserCompanies().subscribe({
      next: (companies: ProCompanyList) => {
        this.isLoading = false;
        this.companies = companies;
        this.companiesOptions = this.convertCompaniesToPoComboOptions(companies.items!);
      },
      error: () => { this.isLoading = false; this.poNotificationService.error('Não foi possível retornar as empresas do usuário.') }
    });
  }

  convertBranchesToPoComboOptions(items: Array<ProBranch>): Array<PoComboOption> {
    return items.map((item: any) => ({
      ...item,
      label: item.Description,
      value: item.Code
    }));
  }

  convertCompaniesToPoComboOptions(items: Array<ProCompany>): Array<PoComboOption> {
    return items.map((item: any) => ({
      ...item,
      label: item.CorporateName,
      value: item.Code
    }));
  }

  getAccessRoutine(): void {
    this.isLoading = true;
    this.proUserAccessService.userHasAccess(this.routine, this.action).subscribe({
      next: (access: ProUserAccessInterface) => { this.isLoading = false; alert('Acesso: ' + access.access + ' - ' + access.message) },
      error: () => { this.isLoading = false; this.poNotificationService.error('Não foi possível consultar o acesso do usuário.') }
    })
  }

  getAccessAlias(): void {
    this.isLoading = true;
    this.proUserAccessService.aliasHasAccess(this.alias).subscribe({
      next: (access: ProUserAccessInterface) => { this.isLoading = false; alert('Acesso: ' + access.access + ' - ' + access.message) },
      error: () => { this.isLoading = false; this.poNotificationService.error('Não foi possível consultar o acesso do usuário.') }
    })
  }
}
