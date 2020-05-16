import { Component } from "@angular/core";

@Component({
  selector: "ns-setting-list",
  templateUrl: "./setting-list.component.html",
  styleUrls: ["./setting-list.component.css"]
})
export class SettingListComponent {
  settings = [
    {
      title: "Grocy API",
      description: "Hostname & API configuration for Grocy",
      link: ["grocy"]
    },
    {
      title: "Barcode Data Sources",
      description: "Configure and order barcode data sources",
      link: ["barcode-sources"]
    },
    {
      title: "External Scanner",
      description: "Have a barcode scanner?",
      link: ["external-scanner"]
    },
    {
      title: "Privacy Settings",
      description: "Control your privacy in this app",
      link: ["privacy"]
    }
  ];
}
