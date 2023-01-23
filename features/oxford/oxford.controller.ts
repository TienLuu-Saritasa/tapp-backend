import axios from 'axios';
import { Request, Response, Router } from 'express';
import { EnvService } from '../../services/env.service';

export class OxfordController {
  protected readonly path = '/oxford/';
  protected readonly router = Router();
  protected readonly envService: EnvService;
  constructor() {
    this.initializeRoutes();
    this.envService = new EnvService();
  }

  private initializeRoutes(): void {
    this.router.get(this.path.concat('search'), this.searchPronunciation);
  }

  searchPronunciation = async (req: Request, res: Response): Promise<Response> => {
    if (req.query.words == '' || req.query.words == null || req.query.words == undefined) {
      return res.send([{
        results: [],
        word: ''
      }]);
    }

    try {
      const words = req.query.words.toString().split(',');
      const oxfordRequests = words.map(word => axios.get(
        `https://od-api.oxforddictionaries.com/api/v2/entries/en-us/${word}?fields=pronunciations`,
        {
          headers: this.envService.getOxfordHeader()
        }
      ));
      const tracauRequests = words.map(word => this.translatePronunciation(word));
      const ozdicRequests = words.map(word => this.getOzdicDictionary(word));

      const [
        oxfordData,
        tracauData,
        ozdicData
      ] = await Promise.all([oxfordRequests, tracauRequests, ozdicRequests].map(p => Promise.all(p)));

      return res.send(oxfordData.map((response, index): any => ({
        ...response.data,
        sentences: tracauData[index],
        ozdic: ozdicData[index]
      })));

    } catch (error) {
      console.log(error);
      return res.send([{
        results: [],
        word: '',
        sentences: [],
        ozdic: null
      }]);
    }
  };

  translatePronunciation = async (word: string): Promise<Array<any>> => {
    try {
      if (process.env.ENV === 'development') {
        const tracauResponse = await axios.get(`https://api.tracau.vn/WBBcwnwQpV89/s/${word}/en`);
        return tracauResponse.data.sentences;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  getOzdicDictionary = async (word: string): Promise<any | null> => {
    try {
      const tracauResponse = await axios.get(`https://ozdic.com/collocation/${word}.txt`);
      return tracauResponse.data;
    } catch (error) {
      return null;
    }
  };
}
