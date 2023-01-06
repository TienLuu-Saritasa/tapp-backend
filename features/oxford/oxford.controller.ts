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
      const oxfordResponses = words.map(word => axios.get(
        `https://od-api.oxforddictionaries.com/api/v2/entries/en-us/${word}?fields=pronunciations`,
        {
          headers: this.envService.getOxfordHeader()
        }
      ));
      const oxfordResponsesData = await Promise.all(oxfordResponses);
      return res.send(oxfordResponsesData.map(response => response.data));
    } catch (error) {
      console.log(error);
      return res.send([{
        results: [],
        word: ''
      }]);
    }
  };
}
