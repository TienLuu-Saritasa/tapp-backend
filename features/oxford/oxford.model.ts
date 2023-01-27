import mongoose from 'mongoose';
import { Dictionary } from '../../interfaces/dictionary';
import { Oxford } from '../../interfaces/oxford';
import { TraCau } from '../../interfaces/tracau';
import { Entry, Pronunciation, Vocabulary } from '../../interfaces/vocabulary';

const pronunciationSchema = new mongoose.Schema<Pronunciation>({
  audioFile: String,
  phoneticNotation: String,
  phoneticSpelling: String,
});

const entrySchema = new mongoose.Schema<Entry>({
  pronunciations: [pronunciationSchema]
});

const vocabularySchema = new mongoose.Schema<Vocabulary>({
  lexicalEntries: [{
    entries: [entrySchema],
    lexicalCategory: {
      id: String,
      text: String,
    }
  }
  ]
});

const tracauSchema = new mongoose.Schema<TraCau>({
  _id: Number,
  fields: {
    en: String,
    vi: String,
  }
});

const oxfordSchema = new mongoose.Schema<Oxford>({
  id: String,
  metadata: {
    operation: String,
    provider: String,
    schema: String,
  },
  results: [vocabularySchema],
  word: String,
});

const dictionarySchema = new mongoose.Schema<Dictionary>({
  oxford: oxfordSchema,
  word: String,
  tracau: [tracauSchema],
  ozdic: String,
});

export const DictionaryModel = mongoose.model<Dictionary>('Dictionary', dictionarySchema, 'dictionary');
