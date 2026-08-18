import type { Request, RequestHandler } from "express";

type ControllerHandler<Data, RequestType extends Request = Request> = {
  handle(request: RequestType): Promise<Data> | Data;
}["handle"];

type ResponseHandler<RequestType extends Request> =
  RequestType extends Request<
    infer Params,
    infer ResponseBody,
    infer RequestBody,
    infer RequestQuery,
    infer Locals extends Record<string, unknown>
  >
    ? RequestHandler<Params, ResponseBody, RequestBody, RequestQuery, Locals>
    : RequestHandler;

interface SuccessResponse<Data> {
  data: Data;
  success: true;
}

export const withResponse = <
  RequestType extends Request = Request,
  Data = unknown,
>(
  handler: ControllerHandler<Data, RequestType>,
): ResponseHandler<RequestType> => {
  const responseHandler: RequestHandler = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const data = await handler(request as RequestType);
      const payload: SuccessResponse<Data> = {
        data,
        success: true,
      };

      response.json(payload);
    } catch (error) {
      next(error);
    }
  };

  return responseHandler as ResponseHandler<RequestType>;
};
