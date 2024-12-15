import { MediaSearchModel } from "./MediaSearchModel"

export interface MediaSearchResponse {
    Response: string
    Search: MediaSearchModel[]
    totalResults: string
}