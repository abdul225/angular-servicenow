import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CREATE_REQUEST_API_URL, GET_REQUEST_URGENCY_CHOICES, SERVER_API_URL } from 'src/app/app.constants';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RequestService } from '../service/request.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-request-new',
  templateUrl: './request-new.component.html',
  styleUrls: ['./request-new.component.css']
})
export class RequestNewComponent {
  
  urgencyChoices:any = this.populateChoices();
  requestJSON:any={};
  variables:any={};
  constructor (private requestService: RequestService,
    private authService:AuthService,
    private spinner:NgxSpinnerService,
    private router: Router){

  }

  populateChoices(): any {
    const getRequestApiUrl=SERVER_API_URL+GET_REQUEST_URGENCY_CHOICES;
    this.requestService.getRequestChoices(getRequestApiUrl).subscribe(
     data=>
     {
       // @ts-ignore
       this.urgencyChoices=data.result[0];
       this.spinner.hide();
       console.log("recieved choices " +JSON.stringify(this.urgencyChoices));
 
     },
     error1 =>
     {
       console.log('Failed to get choices');
       this.spinner.hide();
     }
   );
   return this.urgencyChoices;
  }


  requestForm : FormGroup = new FormGroup({
    comments: new FormControl(''),
    urgency: new FormControl(1),         // Default urgency (Low)  
  });

  submitRequest() {
    // Handle form submission logic here
    console.log("request form value is "+JSON.stringify(this.requestForm.value));
    this.spinner.show();
    const requestApiUrl=SERVER_API_URL+CREATE_REQUEST_API_URL;
    const requestInput = {"variables":this.requestForm};
    console.log("request input value is "+requestInput.toString());
    this.variables = this.requestForm.value;
    this.requestJSON.variables = this.variables;
    console.log("the req" + JSON.stringify(this.requestJSON));


    this.requestService.createRequest(requestApiUrl,this.requestJSON).subscribe(
      data=>
      {
        // @ts-ignore{"variables":{"comments":"test","urgency":"3","contextual_search_results":"","ai_search_assist":""},"sysparm_item_guid":"ca84307e936ab110eee3398efaba109f","get_portal_messages":"true","sysparm_no_validation":"true","engagement_channel":"sp","referrer":"popular_items"}
        this.incidents=data.result;
        this.spinner.hide();
        console.log("incident create successfully");
        this.requestForm.reset();
        this.router.navigate(['/requests']);
      },
      error1 =>
      {
        console.log('Failed to created requests');
        this.spinner.hide();
      }
    );
    // You can send this data to your backend or perform other actions as needed.
  }
}
