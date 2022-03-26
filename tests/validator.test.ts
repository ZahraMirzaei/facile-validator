import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import Validator from '@/facile-validator';

const dom = new JSDOM(`
<!DOCTYPE html>
<div>
  <input data-rules="required">
  <button>Submit</button>
</div>
`);

function initValidator() {
  const div = document.querySelector('div') as HTMLElement;

  return new Validator(div);
}

function startValidation(validator: Validator) {
  const button = document.querySelector('button') as HTMLButtonElement;

  button.addEventListener('click', () => {
    validator.validate();
  });

  button.click();
}

global.HTMLElement = dom.window.HTMLElement;
global.HTMLInputElement = dom.window.HTMLInputElement;
global.document = dom.window.document;

describe('rules: digits', () => {
  it('Should work on valid container', () => {
    const div = document.querySelector('div') as HTMLElement;
    const validator = new Validator(div);

    expect(validator).toBeInstanceOf(Validator);
  });

  it('Should throw error on invalid container', () => {
    expect(() => new Validator()).toThrowError('Invalid parentEl element');
  });
});

describe('Validation events', () => {
  it('should set started to true', () => {
    let started = false;
    const validator = initValidator();

    validator.on('validation:start', () => (started = true));
    startValidation(validator);

    expect(started).toBe(true);
  });

  it('should set ended to true', () => {
    let ended = false;
    const validator = initValidator();

    validator.on('validation:end', () => (ended = true));
    startValidation(validator);

    expect(ended).toBe(true);
  });

  it('should set failed to true', () => {
    let failed = false;
    const validator = initValidator();

    validator.on('validation:failed', () => (failed = true));
    startValidation(validator);

    expect(failed).toBe(true);
  });

  it('should not set succeeded to true', () => {
    let succeeded = false;
    const validator = initValidator();

    validator.on('validation:success', () => (succeeded = true));
    startValidation(validator);

    expect(succeeded).toBe(false);
  });
});
