import toNumber from "https://deno.land/x/lodash/toNumber.js";
import size from "https://deno.land/x/lodash/size.js";

export default class Pagination<T> {
  private total: number = 0;
  private limit: number = 0;
  private items: T[] = [];
  private sortBy: string = '';
  private sortDirection: string = 'ASC';

  constructor() {
  }

  public init(
    items: Array<T>,
    sortBy: string,
    sortDirection: string,
    total: number,
    limit?: number,
  ) {
    this.items = items;
    this.limit = toNumber(limit);
    this.total = toNumber(total);
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  public format(page?: number) {
    if (page) {
      const floatedPages = this.total / this.limit;
      const totalPages = floatedPages - (floatedPages) % 1 +
        ((floatedPages) % 1 < 1 && (floatedPages) % 1 > 0 ? 1 : 0);

      return {
        content: this.items,
        first: toNumber(page) === 1,
        last: toNumber(page) === totalPages,
        number: toNumber(page),
        numberOfElements: size(this.items),
        size: this.limit,
        totalElements: this.total,
        sort: {
          direction: this.sortDirection,
          property: this.sortBy,
        },
        totalPages,
      };
    } else {
      return {
        content: this.items,
        first: true,
        last: true,
        number: page,
        numberOfElements: size(this.items),
        size: this.total,
        totalElements: this.total,
        totalPages: 1,
        sort: {
          direction: this.sortDirection,
          property: this.sortBy,
        },
      };
    }
  }
}
