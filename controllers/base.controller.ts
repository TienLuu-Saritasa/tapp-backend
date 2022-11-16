import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Model } from 'mongoose';
import { HttpResponse } from '../utils/response';

export default abstract class CrudController<T> {
  protected abstract readonly model: Model<T>;
  protected readonly router = Router();

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.model.find().lean();
      return HttpResponse.success(res, { data });
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
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

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = new this.model(req.body);
      await data.save();
      return HttpResponse.success(res, { data }, httpStatus.CREATED);
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };

  deleteById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const data = await this.model.findByIdAndDelete(id).lean();
      if (!data) {
        return HttpResponse.badRequest(res, id);
      }
      return HttpResponse.success(res, { data });
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
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
      return HttpResponse.success(res, { data });
    } catch (error) {
      return HttpResponse.serverError(res, error);
    }
  };
}
