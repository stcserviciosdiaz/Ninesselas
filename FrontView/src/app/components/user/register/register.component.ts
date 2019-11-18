import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  userForm: FormGroup;

  @Input() inputArray;
  subscriber;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    ) {
    this.createRegisterForm();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  createRegisterForm() {
    this.userForm = this.formBuilder.group({
      username: [''],
      password: [''],
      email: ['']
    });
  }

  registrarUsuario() {
    // recipe_name: this.recipeForm.get('recipeName').value,
    const newUserObject = {
      rol: 'Contratante',
      username: this.userForm.get('username').value,
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value
    };
    this.subscriber = this.authService.signup(newUserObject).subscribe(
      res => {
        alert(res); },
      (err) => {
        alert(err); },
      () => {
        alert('Successfully created a new user');
      });

  }

  // submitBtn() {
  //   alert('5')
  //   const newRecipeObject = {
  //     username: 'danni5',
  //     rol: 'gerente5',
  //     email: 'dasd2@da555sd.com',
  //     password: 'jdasdja55'
  //   };
  //   this.subscriber = this.userService.postAPIData(newRecipeObject).subscribe(
  //     res => {
  //       alert(res);},
  //     (err) => {
  //       alert(err);},
  //     () => {
  //       alert('Successfully created a new recipe');
  //     });


  // }

}
