import { Vocabulary } from './vocabulary';

/** Oxford. */
export interface Oxford extends OxfordResponse<Vocabulary> {

  /** Word that is inputted to API. */
  readonly id: string;

  /** Word. */
  readonly word: string;

}

export interface OxfordResponse<T> {

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
  readonly results: readonly T[];
}