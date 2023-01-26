import { Oxford } from './oxford';
import { TraCau } from './tracau';

/** Oxford. */
export interface Dictionary {

  /** Word. */
  readonly word: string;

  /** Oxford. */
  readonly oxford: Oxford;

  /** Translator. */
  readonly tracau: readonly TraCau[];

  /** Ozdic html string. */
  readonly ozdic: string | null;
}