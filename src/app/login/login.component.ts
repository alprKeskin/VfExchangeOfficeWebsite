import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  images = ["./assets/p1.jpg", "./assets/p2.jpg", "./assets/p3.jpg"];
  imagesAlt = ["Autonomous Parking System.", "The future is exciting. Ready?", "Vodafone"];
  email = "";
  pass = "";
  repass = "";
  name = "";
  sname = "";


  constructor(private app: AppComponent, private http: HttpClient) { }

  ngOnInit(): void {
  }


  login() {
    let url = "http://localhost:8088/api/auth/login";
    let body = {"email" : this.email, "password": this.pass};
    this.http.post(url, body).subscribe((res: any) => {
      this.setEmail(res['email']);
      this.setUsername(res['name']);
      this.app.navigate("/home");
    });
    
  }

  signup() {
    let url = "http://localhost:8088/api/auth/register";
    let body = {"email" : this.email, "password": this.pass, "username": this.name, "role": "ADMIN"};
    this.http.post(url, body).subscribe((res: any) => {
      this.setEmail(this.email);
      this.setUsername(this.name);
      this.app.navigate("/home");
    });
  }

  setEmail(email?: string) {
    if(window.localStorage.getItem("email"))
      window.localStorage.removeItem("email");
    window.localStorage.setItem("email", email ?? "");
  }

  setUsername(name?: string) {
    if(window.localStorage.getItem("username"))
      window.localStorage.removeItem("username");
    window.localStorage.setItem("username", name ?? "");
    this.app.username = name ?? "";
  }
}
