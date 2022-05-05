export interface GroceryType {
    type: string,
    color: string,
}

export interface Grocery {
    name: string,
    type: string
}

export interface GroceryCartEntry {
    name: string,
    type: string,
    amount: string
}

export interface GroceryData {
    groceries: Grocery[],
    groceryTypes: GroceryType[],
    groceryCartEntries: GroceryCartEntry[]
}