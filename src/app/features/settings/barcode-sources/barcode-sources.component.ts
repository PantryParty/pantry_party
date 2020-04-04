import { Component, OnInit } from "@angular/core";
import { openUrl } from "@nativescript/core/utils/utils";
import { UPCItemDbService } from "~/app/services/upcitemdb.service";
import { UPCDatabaseService } from "~/app/services/upcdatabase.service";
import { OpenFoodFactsService } from "~/app/services/openfoodfacts.service";
import { arrayMove } from "~/app/utilities/arrayMove";
import { ScannedItemExernalLookupService } from "~/app/services/scanned-item-exernal-lookup.service";
import { EventData } from "tns-core-modules/ui/page/page";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { ActivatedRoute, Router } from "@angular/router";

interface BarcodeServiceDef {
  name: string;
  url: string;
  service: { configurationRequired: boolean; enabled: boolean };
  description: string;
  configurationPath?: string[];
}

@Component({
  selector: "ns-barcode-sources",
  templateUrl: "./barcode-sources.component.html",
  styleUrls: ["./barcode-sources.component.css"]
})
export class BarcodeSourcesComponent {

  barcodeServices: Record<string, BarcodeServiceDef> = {
    openFoodFacts: {
      name: "Open Food Facts",
      url: "https://world.openfoodfacts.org/",
      service: this.openFoodFacts,
      description: `Open Food Facts is a community driven `
        + `non-proift database of food information. It provides unlimited `
        + `lookup information, but has a less comprehensive and user driven `
        + `database.`
    },
    upcItemDb: {
      name: "UPC Item DB",
      url: "https://www.upcitemdb.com",
      service: this.upcItemDb,
      description: `A commercial service which offers 100 look-ups per day via their free API`
    },
    upcDb: {
      name: "UPC Database",
      url: "https://www.upcdatabase.com/",
      service: this.upcDatabase,
      configurationPath: ["/settings/barcode-sources/upcDatabaseConfig"],
      description: `A paid service (Non-Affiliated). $5 gets you 20 `
        + `look-ups per day up to 150 stored up to 150 stored.`
    }
  };

  orderedItems = this.scannedItemExternalLookupService.lookupOrder
      .map((i) => this.barcodeServices[i])
      .filter((i) => !!i);

  constructor(
    public openFoodFacts: OpenFoodFactsService,
    public upcItemDb: UPCItemDbService,
    public upcDatabase: UPCDatabaseService,
    public scannedItemExternalLookupService: ScannedItemExernalLookupService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  enabledSwitchChanged(evt: EventData, item: BarcodeServiceDef) {
    const sw = evt.object as Switch;
    item.service.enabled = sw.checked;
  }

  openUrl(url: string) {
    openUrl(url);
  }

  onItemReordered(args: any) {
    this.scannedItemExternalLookupService.lookupOrder = arrayMove(
      this.scannedItemExternalLookupService.lookupOrder,
      args.index,
      args.data.targetIndex
    );
  }

  sourceTapped(item: BarcodeServiceDef) {
    if (item.configurationPath) {
      this.router.navigate(
        item.configurationPath,
        {relativeTo: this.route}
      );
    }
  }

  switchTap(evt: Event) {
    evt.stopPropagation();
  }

}
