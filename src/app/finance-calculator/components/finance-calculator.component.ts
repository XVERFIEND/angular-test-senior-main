import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input, signal, inject, effect, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, switchMap, catchError, of, startWith } from 'rxjs';

import { Vehicle } from '../../vehicle/models/vehicle.model';
import { FinanceCalculatorService } from '../services/finance-calculator.service';

@Component({
  selector: 'app-finance-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './finance-calculator.component.html',
  styleUrl: './finance-calculator.component.scss',
})
export class FinanceCalculatorComponent {
  // vehicle object input property
  vehicle = input.required<Vehicle>();

  // default state
  term = signal(60);
  deposit = signal(0);

  // store error message
  quoteError = signal<string | null>(null);

  // inject calculator service
  private financeCalculatorService = inject(FinanceCalculatorService);

  constructor() {
    /*
      effect runs whenever dependencies change
      set deposit to 10% of vehicle price
      allowSignalWrites required to modify signal inside effect
    */
    effect(
      () => {
        if (this.vehicle && this.vehicle().price && this.deposit() === 0) {
          this.deposit.set(parseFloat((this.vehicle().price * 0.1).toFixed(2)));
        }
      },
      { allowSignalWrites: true }
    );
  }

  // create single observable stream from term and deposit
  // pipe map into object for ease of use
  private financeInputs$ = combineLatest([
    toObservable(this.term),
    toObservable(this.deposit),
  ]).pipe(
    map(([term, deposit]) => ({
      vehicle: this.vehicle() as Vehicle,
      term,
      deposit,
    }))
  );

  /*
    convert observable stream into signal for result of quote calculation
    when financeInputs$ emits a new value:
    clear any existing error message
    generate new quote with given values, return observable
    catch error
  */
  financeQuote = toSignal(
    this.financeInputs$.pipe(
      switchMap(({ vehicle, term, deposit }) => {
        this.quoteError.set(null);
        return this.financeCalculatorService
          .generateFinanceQuote(vehicle, term, deposit)
          .pipe(
            catchError((err) => {
              this.quoteError.set(err.message);
              return of(null);
            })
          );
      }),
      // both of these ensure that the financeQuote signal has a guaranteed null state
      startWith(null) // ensures initial emit of null observable
    ),
    { initialValue: null } // set initial value of signal to null
  );
}
