type Order = {
    date: Date
    city: string
    name: string
    email: string
    phone: string
    project: boolean
    description: string
}

type TableMonth = {
    number: number
    name: string
    days: Order[]
}

export type { Order, TableMonth }