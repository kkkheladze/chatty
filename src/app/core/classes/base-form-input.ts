import { signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export class BaseFormInput<T> implements ControlValueAccessor {
  public changed!: (value: T) => void;

  public touched!: (value: T) => void;

  public value = signal<T>(null as T);
  public disabled = signal<boolean>(false);

  // Control Value Accessor Logic
  onChanged(event: Event) {
    const value = this.getValueFromEvent(event);
    this.changed(value);
  }

  onTouched(event: Event) {
    const value = this.getValueFromEvent(event);
    this.touched(value);
  }

  writeValue(value: T) {
    this.value.set(value);
  }

  registerOnTouched(fn: any) {
    this.touched = fn;
  }

  registerOnChange(fn: any) {
    this.changed = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled.set(disabled);
  }

  private getValueFromEvent(event: Event) {
    const input = <HTMLInputElement>event.target;
    switch (input.type) {
      case 'checkbox':
        return input.checked as T;
      case 'number':
        return input.valueAsNumber as T;
      case 'date':
        return input.valueAsDate as T;
      default:
        return input.value as T;
    }
  }
}
