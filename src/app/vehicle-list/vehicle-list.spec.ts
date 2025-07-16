import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { VehicleStore } from '../vehicle/vehicle.store';
import { signal } from '@angular/core';
import { VehicleListComponent } from './vehicle-list';

describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;
  let mockVehicleStore: Partial<InstanceType<typeof VehicleStore>>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockVehicleStore = {
      setSearchTerm: jasmine.createSpy('setSearchTerm'),
      setSortType: jasmine.createSpy('setSortType'),
      setSortDirection: jasmine.createSpy('setSortDirection'),
      loading: signal(false),
      vehicles: signal([]),
      error: signal(null),
      filteredAndSortedVehicles: signal([]),
      totalVehicles: signal(0),
      selectedVehicle: signal(undefined),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [VehicleListComponent],
      providers: [
        { provide: VehicleStore, useValue: mockVehicleStore },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls with default values', () => {
    expect(component.searchControl.value).toBe('');
    expect(component.sortTypeControl.value).toBe('price');
    expect(component.sortDirectionControl.value).toBe('asc');
  });

  it('should call setSearchTerm on store when searchControl value changes', (done) => {
    const searchTerm = 'hatchback';
    component.searchControl.setValue(searchTerm);

    setTimeout(() => {
      expect(mockVehicleStore.setSearchTerm).toHaveBeenCalledWith(searchTerm);
      done();
    }, 350);
  });

  it('should call setSortType on store when sortTypeControl value changes', () => {
    const sortType = 'make';
    component.sortTypeControl.setValue(sortType);
    expect(mockVehicleStore.setSortType).toHaveBeenCalledWith(sortType);
  });

  it('should call setSortDirection on store when sortDirectionControl value changes', () => {
    const sortDirection = 'desc';
    component.sortDirectionControl.setValue(sortDirection);
    expect(mockVehicleStore.setSortDirection).toHaveBeenCalledWith(
      sortDirection
    );
  });

  it('should initialize store with form control values on ngOnInit', () => {
    expect(mockVehicleStore.setSearchTerm).toHaveBeenCalledWith('');
    expect(mockVehicleStore.setSortType).toHaveBeenCalledWith('price');
    expect(mockVehicleStore.setSortDirection).toHaveBeenCalledWith('asc');
  });

  it('should navigate to vehicle detail when navigateToVehicleDetail is called', () => {
    const vehicleId = '123';
    component.navigateToVehicleDetail(vehicleId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vehicle', vehicleId]);
  });
});
