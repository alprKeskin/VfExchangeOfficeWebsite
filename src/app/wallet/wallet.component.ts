import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyEntity, DepositDialogComponent } from '../deposit-dialog/deposit-dialog.component';
import { WithdrawDialogComponent } from '../withdraw-dialog/withdraw-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Asset } from '../Asset';
import { AppComponent } from '../app.component';


export interface Currency {
  code: string;
  amount: number;
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  
  elements: Currency[] = [];
  validCurrencyCodes: string[] = [];
  validCurrencies: CurrencyEntity[] = [];
 
  
  myElements: Map<string, Asset> = new Map<string, Asset>();
  url: string = 'http://localhost:8083/api/wallet/assets';



  constructor(public transactionDialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    this.getValidCurrencies();
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
      this.getUserAssets()
    })
  }

  getUserAssets() {
    this.elements = [];
    let headers = new HttpHeaders();
    
    headers = headers.set('email', localStorage.getItem('email') ?? "");


    this.http.get(this.url, {headers: headers} ).subscribe( (res: any) => {
      for(let code of this.validCurrencyCodes) {
        let asset = res[code];
        if(asset)
          this.elements.push({code: code, amount: asset.amount ?? 0})
      }
    } );
  }
  

  deposit(currencyCode: String, amount: number) {
    const dialogRef = this.transactionDialog.open(DepositDialogComponent, {
      data: { code: currencyCode, currencies: this.validCurrencies, amount: amount},
      width: "500px"
    });
    dialogRef.afterClosed().subscribe(() => location.reload());
  }


  withdraw(currencyCode: String, amount: number) {
    const dialogRef = this.transactionDialog.open(WithdrawDialogComponent, {
      data: { code: currencyCode, currencies: this.validCurrencies},
      width: "500px"
    });
    dialogRef.afterClosed().subscribe(() => location.reload());
  }
  
  refresh() {
      this.getUserAssets();
  }

}
