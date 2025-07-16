import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input, signal, inject, effect } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, switchMap, catchError, of, startWith } from 'rxjs';
import { Vehicle } from '../vehicle/vehicle.model';
import { FinanceCalculatorService } from './finance-calculator-service';

@Component({
  selector: 'app-finance-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './finance-calculator.component.html',
  styleUrl: './finance-calculator.component.scss',
})
export class FinanceCalculatorComponent {
  @Input({ required: true }) vehicle!: Vehicle;

  term = signal(60);
  deposit = signal(0);

  quoteError = signal<string | null>(null);

  private financeCalculatorService = inject(FinanceCalculatorService);

  constructor() {
    effect(
      () => {
        if (this.vehicle && this.vehicle.price && this.deposit() === 0) {
          this.deposit.set(parseFloat((this.vehicle.price * 0.1).toFixed(2)));
        }
      },
      { allowSignalWrites: true }
    );
  }

  private financeInputs$ = combineLatest([
    toObservable(this.term),
    toObservable(this.deposit),
  ]).pipe(
    map(([term, deposit]) => ({
      vehicle: this.vehicle as Vehicle,
      term,
      deposit,
    }))
  );

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
      startWith(null)
    ),
    { initialValue: null }
  );
}
