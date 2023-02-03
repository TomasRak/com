type Order = {
    date: Date
    city: string
    name: string
    email: string
    phone: string
    project: boolean
    description: string
    classCounts: ClassCount[]
}

type ClassCount = {
    class: string
    count: number
}

type TableMonth = {
    number: number
    name: string
    days: Order[]
}


export type { Order, TableMonth, ClassCount }