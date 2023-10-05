export type PostDTO = {
    id: number,
    content: string,
    images: string[]
}

export type Post = {
    id: number,
    content: string,
    images: { id: number, path: string }[]
}