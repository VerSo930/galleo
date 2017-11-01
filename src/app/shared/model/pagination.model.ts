export class PaginationModel {
  totalCount = 0;
  limit = 0;
  currentPage = 0;


  constructor(totalCount: number, limit: number, currentPage: number) {
    this.totalCount = totalCount;
    this.limit = limit;
    this.currentPage = currentPage;
  }

  public nextPage(): boolean {
    console.log('next page called: total count: ' + this.totalCount + ' limit: ' + this.limit);
    if (this.currentPage !== 0 && this.limit !== 0) {
      if ((this.currentPage - 1) * this.limit < this.totalCount) {
        this.currentPage++;
        return true;
      } else {
        return false;
      }
    } else {
      throw new Error('One or more pagination parameters are 0! TotalCount: ' + this.totalCount);
    }
  }

  public prevPage(): boolean {
    if (this.currentPage !== 0 && this.limit !== 0) {
      if ((this.currentPage - 1) > 0) {
        this.currentPage++;
        return true;
      } else {
        return false;
      }
    } else {
      throw new Error('One or more pagination parameters are 0! TotalCount: ' + this.totalCount);
    }
  }
}
