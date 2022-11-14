import { Response } from 'express';
import httpStatus, { HttpStatusClasses } from 'http-status';

/** Http response. */
export namespace HttpResponse {

  /** Return success response. */
  export function success<T>(res: Response, data: T, status = httpStatus.OK) {
    return res.status(status).json(data);
  }

  /** Return bad request response. */
  export function badRequest(res: Response, err: any) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: err.message,
      type: err.type,
      errors: err.errors,
    });
  }

  /** Return internal server error response. */
  export function serverError(res: Response, err: any) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: err.message,
      type: err.type,
      errors: err.errors,
    });
  }
}
