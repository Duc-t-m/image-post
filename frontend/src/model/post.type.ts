export type ViewPostDTO = {
    id: number,
    content: string,
    images: string[]
}

export type NewPostDTO = {
    content: string,
    images: File[]
}