import { ImageDTO } from "./image.type"

export type PostDTO = {
    id: number,
    content: string,
    images: ImageDTO[]
}