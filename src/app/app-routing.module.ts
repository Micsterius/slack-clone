import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { MainComponent } from './main/main.component';
import { ChannelMainComponent } from './main/main-page/channel-main/channel-main.component';
import { MainChatComponent } from './main/main-page/main-chat/main-chat.component';
import { UserInfoComponent } from './main/main-page/detail-view-page/user-info/user-info.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'personal', component: UserInfoComponent },
  { path: 'channel-main', component: ChannelMainComponent },
  { path: 'chat-main', component: MainChatComponent },
  { path: '', component: ChannelMainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
