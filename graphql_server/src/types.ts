export type PersonType = {
    id: number,
    first_name: string,
    last_name: string
}

export type MovieType = {
    id: number,
    title: string
    rating: number
    actors: [PersonType]
    categories: [string]
}
