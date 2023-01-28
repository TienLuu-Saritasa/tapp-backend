/** Oxford's thesaurus data. */
export interface Thesaurus {

  /** Word. */
  readonly id: string;

  /** Human-readable word. */
  readonly label: string;

  /** Word that inputted. */
  readonly matchString: string;

  /** Match type. */
  readonly matchType: string;
  
  /** Region (only gb for now) */
  readonly region: string;

  /** Word. */
  readonly word: string;
}
