import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboaradmComponent } from './dashboaradm-component';

describe('DashboaradmComponent', () => {
  let component: DashboaradmComponent;
  let fixture: ComponentFixture<DashboaradmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboaradmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboaradmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
