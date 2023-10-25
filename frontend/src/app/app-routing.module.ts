import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authenticated } from 'src/guard/route.guard';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'home', component: HomeComponent, title: 'Home', canActivate: [authenticated] },
    { path: 'sign-up', component: SignUpComponent, title: 'Sign Up' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }