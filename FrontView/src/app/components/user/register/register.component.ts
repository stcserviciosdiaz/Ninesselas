import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm} from '@angular/forms';
import {AuthService} from '../../../Services/auth.service';
import {Router} from '@angular/router';
import { EmailService } from '../../../Services/email.service';
import {ReactiveFormsModule} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})



export class RegisterComponent implements OnInit {
  companyForm: FormGroup;
  submitted = false;

  username = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  telefono = new FormControl('', Validators.required);
  matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService
    ) {
  }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)], Validators.maxLength(9)],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['',[Validators.required, Validators.pattern(/^-?[0-9][^\.]*$/)]],
    });
  }

  registrarEmpresa() {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.companyForm.invalid) {
      return;
    }
    const newUserObject = this.companyForm.value;
    newUserObject.rol = 'Company';
    //alert('Companía a registrar: ' + JSON.stringify(newUserObject));
    this.authService.signup(newUserObject)
      .subscribe(
       res => {
         localStorage.setItem('token', res.token);
         //console.log('Cuenta de Companía creada exitosamente');
         this.router.navigate(['/company']);
         },
      (err) => {
        alert('SUCCESS!!');
        this.router.navigate(['/login']);
        //console.log(JSON.stringify(err));
       });
      
    // Uncomment this to send emails
    // this.emailService.sendEmail({
    //   from: '[Mailgun Sandbox <postmaster@sandbox6d7a81b77504424c9dd9928da3d501e1.mailgun.org>]',
    //   to: '[correo personal]',
    //   name: 'hola',
    //   text: 'Funciona',
    // })
    //   .subscribe(
    //     () => {},
    //     err => console.log(err)
    //   );
  }


}
