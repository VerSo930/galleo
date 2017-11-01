
export class HttpResponseModel<T> {
  constructor(public data: T, public page: number, public count: number, public ok: boolean, public message: string) {

  }
}
