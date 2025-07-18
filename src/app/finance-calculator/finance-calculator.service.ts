import { Observable, of, throwError } from 'rxjs';
import { FinanceQuote } from './interfaces/finance-quote.interface';
import { Injectable } from '@angular/core';
import { Vehicle } from '../vehicle/models/vehicle.model';
import { FINANCE_MONTHLY_INTEREST_RATE } from '../shared/constants/finance.constants';

@Injectable({
  providedIn: 'root',
})

/**
 * Calculates a finance quote based on vehicle details, term, and deposit.
 * @param vehicle The vehicle for which to calculate the finance.
 * @param term The loan term in months.
 * @param deposit The initial deposit amount.
 * @returns An Observable emitting the calculated FinanceQuote.
 */
export class FinanceCalculatorService {
  generateFinanceQuote(
    vehicle: Vehicle,
    term: number,
    deposit: number
  ): Observable<FinanceQuote> {
    // input validation
    if (!vehicle || typeof vehicle.price !== 'number' || vehicle.price <= 0) {
      return throwError(() => new Error('Vehicle is invalid'));
    }
    if (term <= 0 || typeof term !== 'number') {
      return throwError(() => new Error('Term invalid'));
    }
    if (deposit <= 0 || typeof deposit !== 'number' || !deposit) {
      return throwError(() => new Error('Deposit invalid'));
    }

    return of(this.calculateFinance(vehicle, term, deposit));
  }

  private calculateFinance(
    vehicle: Vehicle,
    term: number,
    deposit: number
  ): FinanceQuote {
    const onTheRoadPrice = vehicle.price; // add in extra costs later
    const totalAmountOfCredit = onTheRoadPrice - deposit;

    const monthlyInterestRate = FINANCE_MONTHLY_INTEREST_RATE;

    let monthlyPayment: number =
      (totalAmountOfCredit * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -term));

    return {
      onTheRoadPrice: parseFloat(onTheRoadPrice.toFixed(2)),
      totalDeposit: parseFloat(deposit.toFixed(2)),
      totalAmountOfCredit: parseFloat(totalAmountOfCredit.toFixed(2)),
      numberOfMonthlyPayments: term,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    };
  }
}
