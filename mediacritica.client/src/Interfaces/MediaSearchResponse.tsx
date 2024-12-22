import { MediaSearchModel } from "./MediaSearchModel"

export interface MediaSearchResponse {
    response: string
    search: MediaSearchModel[]
    totalResults: string
}