import axios, { RawAxiosRequestHeaders } from 'axios';
import { Request, Response, Router } from 'express';
import { GoogleAuth } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';
import { Dictionary } from '../../interfaces/dictionary';
import { Oxford } from '../../interfaces/oxford';
import { TraCau } from '../../interfaces/tracau';
import { EnvService } from '../../services/env.service';
import { DictionaryModel } from './oxford.model';

/** Lesson */
interface Lesson {

  /** Name. */
  readonly name: string;

  /** Value. */
  readonly value: number;

  /** Range in google sheet. */
  readonly range: string;
}

export class OxfordController {
  protected readonly path = '/oxford/';
  protected readonly router = Router();
  private readonly envService = new EnvService();
  private readonly googleSheetService: sheets_v4.Sheets;
  private readonly oxfordAxiosHeader: RawAxiosRequestHeaders;

  public constructor() {
    this.initializeRoutes();
    this.oxfordAxiosHeader = this.envService.getOxfordHeader();
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
      credentials: this.envService.getGoogleCredentials()
    });
    this.googleSheetService = google.sheets({ version: 'v4', auth });
  }

  private initializeRoutes(): void {
    this.router.get(this.path.concat('search'), this.searchPronunciation);
    this.router.get(this.path.concat('sheet/:lesson'), this.getDictionariesFromSheet);
    this.router.get(this.path.concat('lessons'), this.getLessonsController);
  }

  private searchPronunciation = async (req: Request, res: Response): Promise<Response> => {
    if (req.query.words == '' || req.query.words == null || req.query.words == undefined) {
      return res.send([{
        results: [],
        word: ''
      }]);
    }

    try {
      const words = req.query.words.toString().split(',');
      const dictionaries = await this.getDictionariesForWords(words);
      return res.send(dictionaries);
    } catch (error) {
      return res.send([{
        results: [],
        word: '',
        sentences: [],
        ozdic: null
      }]);
    }
  };

  private getDictionariesForWords = async (words: string[]): Promise<Dictionary[]> => {
    const dictionariesRequests = words.map(word => this.getDictionariesForWord(word));
    const dictionaries = await Promise.all(dictionariesRequests);
    return dictionaries;
  };

  private getDictionariesForWord = async (word: string): Promise<Dictionary> => {
    const existWord = await DictionaryModel.findOne({ word }).exec();
    if (existWord == null) {

      const [
        oxford,
        tracau,
        ozdic
      ] = await Promise.all([
        this.getOxfordDictionary(word),
        this.translatePronunciation(word),
        this.getOzdicDictionary(word)
      ]);

      const result = {
        word,
        oxford,
        tracau,
        ozdic,
      };
      
      const isExistInOxfordDictionary = oxford.results.length;
      if(isExistInOxfordDictionary){
        const newTour = new DictionaryModel(result);
        await newTour.save();
      }

      return result;

    }
    return existWord;
  };

  private translatePronunciation = async (word: string): Promise<TraCau[]> => {
    try {
      if (process.env.ENV === 'development') {
        const tracauResponse = await axios.get(`https://api.tracau.vn/WBBcwnwQpV89/s/${word}/en`);
        return tracauResponse.data.sentences;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  private getOzdicDictionary = async (word: string): Promise<Dictionary['ozdic']> => {
    try {
      const tracauResponse = await axios.get(`https://ozdic.com/collocation/${word}.txt`);
      return tracauResponse.data;
    } catch (error) {
      return null;
    }
  };

  private getOxfordDictionary = async (word: string): Promise<Oxford> => {
    try {
      const oxfordResponse = await axios.get<Oxford>(
        `https://od-api.oxforddictionaries.com/api/v2/entries/en-us/${word}?fields=pronunciations`,
        { headers: this.oxfordAxiosHeader }
      );
      return oxfordResponse.data;
    } catch (error) {
      return {
        results: [],
        word,
        id: word,
        metadata: {
          operation: '',
          provider: '',
          schema: '',
        },
      };
    }
  };

  /**
   * Gets cell values from a Spreadsheet.
   * @param req Request.
   * @param res Response.
   */
  private getDictionariesFromSheet = async (req: Request, res: Response): Promise<Response> => {

    const lesson = Number(req.params.lesson);
    try {
      const lessons = await this.getLessons();
      const words = await this.getSheetData(lessons[lesson].range);
      const dictionaries = await this.getDictionariesForWords(words);
      return res.send(dictionaries);
    } catch (err) {
      return res.send([]);
    }
  };

  private getSheetData = async (range: string): Promise<string[]> => {
    const sheetData = await this.googleSheetService.spreadsheets.values.get({
      spreadsheetId: this.envService.getGoogleSheetId(),
      range: range,
    });

    // Word return from sheet is string type.
    return (sheetData.data.values as string[][]).flat().filter(Boolean).map(word => word.trim());
  };

  private toRangeForLesson(fromCell: string, toCell: string): string {
    const tab = 'DAILY VOCABULARY';
    return `${tab}!${fromCell}:${toCell}`;
  }

  private getLessons = async (): Promise<Lesson[]> => {
    const ranges = [
      this.toRangeForLesson('C2', 'H23'),
      this.toRangeForLesson('C24', 'H33'),
      this.toRangeForLesson('C34', 'H41'),
      this.toRangeForLesson('C42', 'H51'),
      this.toRangeForLesson('C52', 'H64'),
      this.toRangeForLesson('C65', 'H79'),
      this.toRangeForLesson('C80', 'H82'),
      this.toRangeForLesson('C83', 'H95'),
      this.toRangeForLesson('C96', 'H107'),
      this.toRangeForLesson('C108', 'H121'),
      this.toRangeForLesson('C122', 'H139'),
      this.toRangeForLesson('C140', 'H164'),
      this.toRangeForLesson('C165', 'H171'),
    ];
    const lessonNames = await this.getSheetData(this.toRangeForLesson('A2', 'A500'));
    return lessonNames.map((name, index) => ({
      name,
      value: index,
      range: ranges[index]
    }));
  };

  private getLessonsController = async (req: Request, res: Response): Promise<Response> => {
    const lessons = await this.getLessons();
    return res.send(lessons);
  };
}
