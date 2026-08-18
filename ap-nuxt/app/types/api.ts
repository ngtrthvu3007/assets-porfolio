// Shape of NestJS's default HTTP exception body, e.g.
// { "message": "...", "error": "Not Found", "statusCode": 404 }
export interface ApiError {
  message: string
  error?: string
  statusCode: number
}

export interface ApiSuccessResponse<Data> {
  data: Data
  success: true
}
