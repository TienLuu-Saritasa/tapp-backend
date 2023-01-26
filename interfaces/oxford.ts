import { Vocabulary } from './vocabulary';

/** Oxford. */
export interface Oxford {

  /** Word that is inputted to API. */
  readonly id: string;

  /** Metadata. */
  readonly metadata: {

    /** Operation. */
    readonly operation: string;

    /** Provider. */
    readonly provider: string;

    /** Schema. */
    readonly schema: string;
  };

  /** Vocabularies. */
  readonly results: readonly Vocabulary[];

  /** Word. */
  readonly word: string;

}