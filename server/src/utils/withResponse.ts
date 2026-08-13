import type { Request, RequestHandler } from "express";

type ControllerHandler<Data> = (request: Request) => Promise<Data> | Data;

interface SuccessResponse<Data> {
  data: Data;
  success: true;
}

export const withResponse = <Data>(
  handler: ControllerHandler<Data>,
): RequestHandler => {
  return async (request, response, next): Promise<void> => {
    try {
      const data = await handler(request);
      const payload: SuccessResponse<Data> = {
        data,
        success: true,
      };

      response.json(payload);
    } catch (error) {
      next(error);
    }
  };
};
