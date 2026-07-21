export type ApiError = string | null;

export interface ApiResult<T> {
  data: T | null;
  error: ApiError;
}

export interface ActionResult {
  error: ApiError;
}

export interface RecoveryResult extends ActionResult {
  recovered: boolean;
}