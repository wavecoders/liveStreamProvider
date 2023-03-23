import { FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() loggedIn = new EventEmitter(false)

  loggedin = false
  correct = false

  get isValid() {
    return this.form.valid
  }

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    const data = sessionStorage.getItem('loggedin') || undefined

    if(data) {
      const state = JSON.parse(data)
      if(state) this.loggedin = state.loggedin
    }

    this.loggedIn.emit(this.loggedin)

  }

  onLogin() {

    if(this.form.valid) {

      const info = this.form.value

      const isUser = (info.username === 'quickplay' && info.password === 'TestMe123!') ? true : false

      if(isUser) {
        sessionStorage.setItem('loggedin', JSON.stringify({ loggedin: true }))
        this.loggedin = true
        this.loggedIn.emit(this.loggedin)
      } else {
        this.form.reset()
        this.form.markAllAsTouched()
      }

    }

  }

  onLogout() {
    this.form.reset()
    sessionStorage.clear()
    this.loggedin = false
    this.loggedIn.emit(this.loggedin)
  }

}
