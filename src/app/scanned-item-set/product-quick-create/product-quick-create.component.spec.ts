import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductQuickCreateComponent } from './product-quick-create.component';

describe('ProductQuickCreateComponent', () => {
  let component: ProductQuickCreateComponent;
  let fixture: ComponentFixture<ProductQuickCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductQuickCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQuickCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
