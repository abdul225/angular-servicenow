import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestsComponent } from './requests.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestNewComponent } from './request-new/request-new.component';

const routes: Routes = [
  { path: '', component: RequestsComponent },
  { path: 'list', component: RequestListComponent },
  { path: 'new', component: RequestNewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule { }
