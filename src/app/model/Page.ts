export interface Page<T> {
  content: Array<T>,
  pageable: {
    sort: {
      sorted: boolean,
      unsorted: boolean,
      empty: boolean
    },
    offset: number,
    pageNumber: number,
    pageSize: number,
    paged: boolean,
    unpaged: boolean
  },
  last: boolean,
  totalPages: number,
  totalElements: number,
  number: number,
  first: boolean,
  numberOfElements: number,
  sort: {
    sorted: boolean,
    unsorted: boolean,
    empty: false
  },
  size: number,
  empty: boolean
}
