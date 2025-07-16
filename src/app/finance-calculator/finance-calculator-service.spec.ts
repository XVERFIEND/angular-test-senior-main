import { TestBed } from '@angular/core/testing';
import { FinanceCalculatorService } from './finance-calculator-service';
import { Vehicle } from '../vehicle/vehicle.model';
import { FINANCE_MONTHLY_INTEREST_RATE } from '../shared/finance.constants';

describe('FinanceCalculatorService', () => {
  let service: FinanceCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinanceCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateFinanceQuote', () => {
    const mockVehicle: Vehicle = {
      id: '1',
      make: 'TestMake',
      model: 'TestModel',
      price: 20000,
      year: 2020,
      mileage: 10000,
      colour: 'Black',
    };

    it('should return a finance quote for valid inputs', (done) => {
      const term = 60;
      const deposit = 2000;

      service
        .generateFinanceQuote(mockVehicle, term, deposit)
        .subscribe((quote) => {
          expect(quote).toBeDefined();
          expect(quote.onTheRoadPrice).toBe(20000);
          expect(quote.totalDeposit).toBe(2000);
          expect(quote.numberOfMonthlyPayments).toBe(60);
          expect(quote.totalAmountOfCredit).toBe(18000);

          const monthlyInterestRate = FINANCE_MONTHLY_INTEREST_RATE;
          const totalAmountOfCredit = mockVehicle.price - deposit;
          const expectedMonthlyPayment =
            (totalAmountOfCredit * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -term));
          expect(quote.monthlyPayment).toBe(
            parseFloat(expectedMonthlyPayment.toFixed(2))
          );
          done();
        });
    });

    it('should throw an error if vehicle is invalid (null)', (done) => {
      service.generateFinanceQuote(null as any, 60, 2000).subscribe({
        error: (error) => {
          expect(error.message).toBe('Vehicle is invalid');
          done();
        },
      });
    });

    it('should throw an error if vehicle price is not a number', (done) => {
      const invalidVehicle = { ...mockVehicle, price: 'abc' as any };
      service.generateFinanceQuote(invalidVehicle, 60, 2000).subscribe({
        error: (error) => {
          expect(error.message).toBe('Vehicle is invalid');
          done();
        },
      });
    });

    it('should throw an error if vehicle price is zero', (done) => {
      const invalidVehicle = { ...mockVehicle, price: 0 };
      service.generateFinanceQuote(invalidVehicle, 60, 2000).subscribe({
        error: (error) => {
          expect(error.message).toBe('Vehicle is invalid');
          done();
        },
      });
    });

    it('should throw an error if vehicle price is negative', (done) => {
      const invalidVehicle = { ...mockVehicle, price: -100 };
      service.generateFinanceQuote(invalidVehicle, 60, 2000).subscribe({
        error: (error) => {
          expect(error.message).toBe('Vehicle is invalid');
          done();
        },
      });
    });

    it('should throw an error if term is zero or negative', (done) => {
      service.generateFinanceQuote(mockVehicle, 0, 2000).subscribe({
        error: (error) => {
          expect(error.message).toBe('Term invalid');
          done();
        },
      });
    });

    it('should calculate correctly with zero deposit', (done) => {
      const term = 36;
      const deposit = 0;
      service
        .generateFinanceQuote(mockVehicle, term, deposit)
        .subscribe((quote) => {
          expect(quote.totalDeposit).toBe(0);
          expect(quote.totalAmountOfCredit).toBe(mockVehicle.price);

          const monthlyInterestRate = FINANCE_MONTHLY_INTEREST_RATE;
          const totalAmountOfCredit = mockVehicle.price;
          const expectedMonthlyPayment =
            (totalAmountOfCredit * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -term));
          expect(quote.monthlyPayment).toBe(
            parseFloat(expectedMonthlyPayment.toFixed(2))
          );
          done();
        });
    });
  });
});
