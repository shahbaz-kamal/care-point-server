export interface IPaginationOptions {
    page?: string | number
    limit?:string | number
    sortBy?:string
    sortOrder?:string
}

export interface IPaginationOptionsResult {
    page:  number
    limit: number
    skip:number
    sortBy:string
    sortOrder:string
}