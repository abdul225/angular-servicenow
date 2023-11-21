import {Component,inject, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SERVER_API_URL, INCIDENT_API_URL, CREATE_INCIDENT_API_URL, GET_INCIDENT_CHOICES } from 'src/app/app.constants';
import { IncidentService } from '../service/incident.service';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-incident-new',
  templateUrl: './incident-new.component.html',
  styleUrls: ['./incident-new.component.css'],
})
export class IncidentNewComponent implements OnInit {
  choices:any = this.populateChoices();
  categories:any ;
  subcategories:any;
  ngOnInit(): void {
    //this.populateChoices();
    this.incidentForm.get("category").valueChanges.subscribe(selectedValue => {

      console.log('firstname valu changed'+JSON.stringify(this.choices.subCategories[selectedValue] ));
      console.log(selectedValue);           
      this.subcategories = this.choices.subCategories[selectedValue];                   //latest value of firstname
      console.log(this.incidentForm.get("category").value);   //latest value of firstname
    })
  }
  constructor(private incidentService: IncidentService,
    private authService:AuthService,
    private spinner:NgxSpinnerService,
    private router: Router)
{

}
  populateChoices(){
    const getincidentsApiUrl=SERVER_API_URL+GET_INCIDENT_CHOICES;
    this.incidentService.getIncidentChoices(getincidentsApiUrl).subscribe(
     data=>
     {
       // @ts-ignore
       this.choices=data.result[0];
       this.spinner.hide();
       console.log("recieved choices " +JSON.stringify(this.choices.subCategories['inquiry']));
       this.categories = this.choices.categories;
       this.subcategories = this.choices.subCategories[0];
 
     },
     error1 =>
     {
       console.log('Failed to get choices');
       this.spinner.hide();
     }
   );
   return this.choices;
  }
  //c:any = JSON.parse('{"choices":{"categories":[{"value":"","label":"-- None --","subcategories":[]},{"value":"inquiry","label":"Inquiry / Help","subcategories":[{"value":"antivirus","label":"Antivirus"},{"value":"email","label":"Email"},{"value":"internal application","label":"Internal Application"}]},{"value":"software","label":"Software","subcategories":[{"value":"email","label":"Email"},{"value":"os","label":"Operating System"}]},{"value":"hardware","label":"Hardware","subcategories":[{"value":"cpu","label":"CPU"},{"value":"disk","label":"Disk"},{"value":"keyboard","label":"Keyboard"},{"value":"memory","label":"Memory"},{"value":"monitor","label":"Monitor"},{"value":"mouse","label":"Mouse"}]},{"value":"network","label":"Network","subcategories":[{"value":"dhcp","label":"DHCP"},{"value":"dns","label":"DNS"},{"value":"ip address","label":"IP Address"},{"value":"vpn","label":"VPN"},{"value":"wireless","label":"Wireless"}]},{"value":"database","label":"Database","subcategories":[{"value":"db2","label":"DB2"},{"value":"oracle","label":"Oracle"},{"value":"sql server","label":"MS SQL Server"}]}],"impact":[{"value":"1","label":"1 - High"},{"value":"2","label":"2 - Medium"},{"value":"3","label":"3 - Low"}],"urgency":[{"value":"1","label":"1 - High"},{"value":"2","label":"2 - Medium"},{"value":"3","label":"3 - Low"}]}}').choices.categories;
  //categories:any= JSON.parse(this.choices).categories;
  //categories:any = JSON.parse(this.choices).categories;
  incidentForm : FormGroup = new FormGroup({
    caller_id : new FormControl(this.authService.currentUserValue.sysId),
    category: new FormControl(''), // Default category
    subcategory: new FormControl(''),
    impact: new FormControl(1),          // Default impact (Low)
    description: new FormControl(''),
    short_description: new FormControl(''),
    urgency: new FormControl(1),         // Default urgency (Low)
    priority: new FormControl(1)         // Default priority (Critical)
  });
  incident: any = {
    caller: '',
    category: 'Hardware', // Default category
    impact: '1',          // Default impact (Low)
    description: '',
    short_description:'',
    urgency: '1',         // Default urgency (Low)
    priority: '1'         // Default priority (Critical)
  };

  


  submitIncident() {
    // Handle form submission logic here
    console.log(this.incidentForm.value);
    this.spinner.show();
    const incidentsApiUrl=SERVER_API_URL+CREATE_INCIDENT_API_URL;
    this.incidentService.createIncident(incidentsApiUrl,this.incidentForm.value).subscribe(
      data=>
      {
        // @ts-ignore
        this.incidents=data.result;
        this.spinner.hide();
        console.log("incident create successfully");
        this.incidentForm.reset();
        this.router.navigate(['/incident']);
      },
      error1 =>
      {
        console.log('Failed to created incidents');
        this.spinner.hide();
      }
    );
    // You can send this data to your backend or perform other actions as needed.
  }

  

}
