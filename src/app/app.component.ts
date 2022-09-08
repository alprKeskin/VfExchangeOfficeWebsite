import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CurrencyEntity } from './deposit-dialog/deposit-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  bannerIsVisible: Boolean = true;
  username = "";
  validCurrencyCodes: string[] = [];
  validCurrencies: CurrencyEntity[] = [];

  constructor(private location: Location, private router: Router, private cdr: ChangeDetectorRef, private http: HttpClient) {
    
  }

  ngAfterViewInit(): void {
    this.handleNavigationBar(this.location.path().replace("/",""));
    this.username = window.localStorage.getItem("username") ?? "";
    this.cdr.detectChanges();
  }

  handleNavigationBar(locationPath: string) {
    if(locationPath === "login") {
      this.bannerIsVisible = false;
      return;
    }
    this.bannerIsVisible = true;
    if(locationPath.length == 0)
      locationPath = "home"
    
    this.handleNavigationButtons(locationPath);
  }

  handleNavigationButtons(locationPath: string) {
    let desiredClass = locationPath + "-btn";
    let activeClass = "active-page";
    let navigationCollection : HTMLCollection = document.getElementsByClassName("navi-btn");
    
    for (let i in navigationCollection) {
      var className = navigationCollection[i].className;
     
      if (className && className.indexOf(activeClass) > -1) {
        navigationCollection[i].classList.remove(activeClass);
      }
      if (className && className.indexOf(desiredClass) > -1) {
        navigationCollection[i].classList.add(activeClass);
        continue;
      }
      
      
    }
  }

  navigate(path: string) {
    this.handleNavigationBar(path.replace("/",""));
    this.router.navigate([path])
  }

  logout() {
    if(localStorage.getItem('email'))
      localStorage.removeItem('email')
    if(localStorage.getItem('username'))
      localStorage.removeItem('username')
  }

  isLoggedIn() :boolean {
    if(localStorage.getItem('email'))
      return true;
    return false;
  }

  login() {
    this.bannerIsVisible = false;
    this.router.navigate(['/login'])
  }
}
