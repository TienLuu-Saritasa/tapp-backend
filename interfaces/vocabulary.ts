/** Vocabulary. */
export interface Vocabulary {

  /** Lexical entries. */
  readonly lexicalEntries: readonly LexicalEntries[];
}

/**  Lexical entries dto. */
export interface LexicalEntries {

  /** Entries. */
  readonly entries: readonly Entry[];

  /** Lexical category. */
  readonly lexicalCategory: {

    /** Category. */
    readonly id: string;

    /** Readable category. */
    readonly text: string;
  };
}

/** Entry. */
export interface Entry {

  /** Pronunciations. */
  readonly pronunciations: readonly Pronunciation[];
}

/** Pronunciation data. */
export interface Pronunciation {

  /** Audio link. */
  readonly audioFile: string | undefined;

  /** Notation. */
  readonly phoneticNotation: 'respell' | 'IPA';

  /** Spelling. */
  readonly phoneticSpelling: string;
}
