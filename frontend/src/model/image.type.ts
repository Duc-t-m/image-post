import { Post } from "./post.type";

export type Image = {
    path: string,
    post: Post
}

export type ImageDTO = {
    path: string,
    post: number
}