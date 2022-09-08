import { AfterViewInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyEntity } from '../deposit-dialog/deposit-dialog.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Asset } from '../Asset';

export interface WithdrawDialogData {
  amount: number;
  code: string;
  currencies: CurrencyEntity[];
}

@Component({
  selector: 'app-withdraw-dialog',
  templateUrl: './withdraw-dialog.component.html',
  styleUrls: ['./withdraw-dialog.component.scss']
})
export class WithdrawDialogComponent implements AfterViewInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: WithdrawDialogData,
  private dialogRef: MatDialogRef<WithdrawDialogData>,
  private http: HttpClient) { 
    this.amount = data.amount;
    this.currency = this.getCurrency(data.code);
    this.currencies = data.currencies;
  }
  ngAfterViewInit(): void {
    this.amount = this.data.amount;
    this.currency = this.getCurrency(this.data.code);
    this.currencies = this.data.currencies;
    document.getElementById("amountInput")?.setAttribute("max", String(this.amount));
  }

  amount = 0;
  currency: CurrencyEntity;
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


  withdrawUrl: string = "http://localhost:8083/api/wallet/withdraw";
  withdrawMoney() {
    let requestBody: any = {
      email: localStorage.getItem('email') ?? "",
      assetCode: this.currency.code,
      amount: this.amount
    };

    // send a post request
    this.http.post<Map<string, Asset>>(this.withdrawUrl, requestBody, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe( (result) => {
      console.warn(result);
    } )

    console.log("EXIT ==> withdraw-dialog.component.ts::withdrawMoney()");
  }

}
