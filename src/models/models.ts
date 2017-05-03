export interface IUser {
    $key?: string,
    dateCreated: string
}

export interface IList {
    $key?: string,
    name: string,
    isActive: boolean,
    dateCreated: string
}

export interface IRecipe {
    $key?: string,
    name: string,
    isActive: boolean,
    dateCreated: string
}

export interface IItem {
    $key?: string,
    name: string,
    categoryId: string
}

export interface IListItem {
    $key?: string,
    itemId: string,
    quantity: number,
    isCompleted: boolean
}

export interface IItemPurchase {
    $key?: string,
    cost: string,
    vendorId: string,
    dateOfPurchase: string
}

export interface ICategory {
    $key?: string,
    name: string,
    isActive: boolean
}

export interface IVendor {
    $key?: string,
    name: string,
    isActive: boolean
}