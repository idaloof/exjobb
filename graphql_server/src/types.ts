export type ActorType = {
    id: number,
    first_name: string,
    last_name: string
}

export type MovieType = {
    id: number,
    title: string
    rating: number
    actors: [ActorType]
    categories: [string]
}
