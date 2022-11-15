import * as express from 'express';
import httpStatus from 'http-status';
import { HttpResponse } from '../utils/response';

export default abstract class CrudController {
  abstract model: any;
  public router = express.Router();

  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const data = await this.model.find().lean();
      return HttpResponse.success(res, { data });
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };

  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id).lean();
      if (!data) {
        return HttpResponse.badRequest(res, id);
      }
      return HttpResponse.success(res, { data });
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };

  create = async (req: express.Request, res: express.Response) => {
    try {
      const data = new this.model(req.body);
      await data.save();
      return HttpResponse.success(res, data, httpStatus.CREATED);
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };

  deleteById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findByIdAndDelete(id).lean();
      if (!data) {
        return HttpResponse.badRequest(res, id);
      }
      return HttpResponse.success(res, data);
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };

  update = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model
        .findOneAndUpdate(
          { _id: id },
          {
            $set: { ...req.body },
          },
          { new: true }
        )
        .lean();
      if (!data) {
        return HttpResponse.badRequest(res, id);
      }
      return HttpResponse.success(res, data);
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };
}
