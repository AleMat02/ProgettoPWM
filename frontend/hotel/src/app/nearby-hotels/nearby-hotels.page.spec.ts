import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NearbyHotelsPage } from './nearby-hotels.page';

describe('NearbyHotelsPage', () => {
  let component: NearbyHotelsPage;
  let fixture: ComponentFixture<NearbyHotelsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NearbyHotelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
