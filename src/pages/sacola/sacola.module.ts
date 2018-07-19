import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SacolaPage } from './sacola';

@NgModule({
  declarations: [
    SacolaPage,
  ],
  imports: [
    IonicPageModule.forChild(SacolaPage),
  ],
})
export class SacolaPageModule {}
