export type ActorType = {
    id?: number,
    first_name?: string,
    last_name?: string
    movies?: [{
        movie: MovieType
    }]
    manuscripts?: [Manus]
}

export type Manus = {
    id?: number,
    author?: ActorType,
    year?: number,
}

export type MovieType = {
    id?: number,
    title?: string
    rating?: number
    characters?: CharacterType
    categories?: [{
        category?: {
            type: string
        }
    }]
}

export type CharacterType = {
    character?: string
    played_by?: ActorType
}
