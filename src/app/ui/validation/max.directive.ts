import {
  Directive,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

import { maxValidator } from './max.validator';

const MAX_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxDirective),
  multi: true,
};

@Directive({
  selector: '[max][formControlName],[max][formControl],[max][ngModel]',
  providers: [MAX_VALIDATOR],
  standalone: false,
})
export class MaxDirective implements Validator, OnInit, OnChanges {
  @Input() max?: number;

  private _validator?: ValidatorFn;
  private _onChange?: () => void;

  ngOnInit(): void {
    if (typeof this.max === 'number') {
      this._validator = maxValidator(this.max);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const key in changes) {
      if (key === 'max') {
        this._validator = maxValidator(changes[key].currentValue);
        if (this._onChange) {
          this._onChange();
        }
      }
    }
  }

  validate(c: AbstractControl): { [key: string]: any } | null {
    if (this._validator) {
      return this._validator(c) as { [key: string]: any };
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}
