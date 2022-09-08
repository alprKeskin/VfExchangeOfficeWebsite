import { AfterViewInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Asset } from '../Asset';

export interface DepositDialogData {
  code: string;
  currencies: CurrencyEntity[];
  amount: number;
}

export interface CurrencyEntity {
  code: string;
  name: string;
}

@Component({
  selector: 'app-deposit-dialog',
  templateUrl: './deposit-dialog.component.html',
  styleUrls: ['./deposit-dialog.component.scss']
})
export class DepositDialogComponent implements AfterViewInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DepositDialogData,
  private dialogRef: MatDialogRef<DepositDialogData>,
  private http: HttpClient) { 
    this.amount = this.data.amount;
    this.currency = this.getCurrency(this.data.code);
    this.currencies = this.data.currencies;
  }
  ngAfterViewInit(): void {
    this.amount = this.data.amount;
    this.currency = this.getCurrency(this.data.code);
    this.currencies = this.data.currencies;
  }

  amount = 0;
  currency: CurrencyEntity = {code: "", name: ""};
  currencies: CurrencyEntity[] = [];

  changeCurrency(currency: CurrencyEntity) {
    this.currency = currency;
  }

  getCurrency(currencyCode: string): CurrencyEntity {
    for(let currency of this.currencies) {
      if(currency.code === currencyCode)
        return currency;
    }

    return {code: "", name: ""};
  }

  depositUrl: string = "http://localhost:8083/api/wallet/deposit";
  depositMoney() {
    let requestBody: any = {
      email: localStorage.getItem('email') ?? "",
      assetCode: this.currency.code,
      amount: this.amount
    };

    // send a post request
    this.http.post<Map<string, Asset>>(this.depositUrl, requestBody, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe( (result) => {
      console.warn(result);
    } )

  }
}
