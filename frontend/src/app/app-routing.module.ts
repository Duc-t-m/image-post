import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authenticated } from 'src/guard/route.guard';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PendingComponent } from './pending/pending.component';
import { RedirectComponent } from './redirect/redirect.component';

const routes: Routes = [
    { path: '', component: PendingComponent, pathMatch: 'full', title: 'Pending' },
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'home', component: HomeComponent, title: 'Home', canActivate: [authenticated] },
    { path: 'sign-up', component: SignUpComponent, title: 'Sign Up' },
    { path: 'oauth2/redirect', component: RedirectComponent, title: 'Authenticating' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }