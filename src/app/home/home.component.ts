import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { CurrencyEntity } from '../deposit-dialog/deposit-dialog.component';

export interface Currency {
  no: number;
  code: string;
  name: string;
  value: number;
}

const ELEMENT_DATA: Currency[] = [
  {no: 1, code: 'EUR', name: "Euro", value: 0.99},
  {no: 2, code: 'TRY', name: "Turkish Lira", value: 0.052},
  {no: 3, code: 'KWD', name: "Kuwait Dinar", value: 3.24}
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('paginator', { static: true })
  paginator!: MatPaginator;
  @ViewChild('sort', { static: true })
  sort!: MatSort;
  pageBtnName = "home-btn"

  currencies: Currency[] = [];

  displayedColumns: string[] = ['no', 'code', 'name', 'value'];
  validCurrencyCodes: string[] = [];
  validCurrencies: CurrencyEntity[] = [];
  dataSource = new MatTableDataSource(this.currencies);

  constructor(private app: AppComponent, private http: HttpClient, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.getValidCurrencies()
  }

  search(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchOnMs(filterValue);
    
    this.dataSource.filterPredicate = function (data, filter: string) : boolean {
      return data.code.toLowerCase().includes(filter) || data.name.toLowerCase().includes(filter);
    }

    this.dataSource.filter = filterValue;
  }

  getValidCurrencies() {
    let url = "http://localhost:8082/api/currency/currencies";
    this.validCurrencies = [];
    this.validCurrencyCodes = [];
    this.http.get(url).subscribe((res: any) => {
      Object.keys(res).forEach(key => this.validCurrencyCodes.push(key));
      for(let code of this.validCurrencyCodes) {
        let name: string = res[code] ?? "";
        this.validCurrencies.push({code: code, name: name });
      }
      this.getCurrencies()
    })
  }

  getCurrencies() {
    let url = "http://localhost:8082/api/currency";
    this.currencies = [];
    this.http.get(url).subscribe((res: any) => {
      console.log(res)
      let rates = res['rates'];
      let index = 0;
      for(let validCur of this.validCurrencies) {
        let value = rates[validCur.code] ?? 0;
        let currency: Currency = {no: ++index, code: validCur.code, name: validCur.name, value: value}
        console.log(validCur.code)
        this.currencies.push(currency);
      }
      this.refreshAndInitDataTable();
      console.log(this.currencies)
    })
  }

  searchOnMs(filterVal: string) {
    this.callSearchEndpoint(filterVal);    
  }

  callSearchEndpoint(code: string) {
    let url = "http://localhost:8081/api/search/" + code.toUpperCase();
    this.http.get(url).subscribe();
  }

  refreshAndInitDataTable() {
    this.dataSource = new MatTableDataSource(this.currencies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 

  }

}


