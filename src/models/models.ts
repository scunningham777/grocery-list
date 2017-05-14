export class User {
    constructor(
        public $key: string,
        public dateCreated: string
    ) { }

    static fromJson({ $key, dateCreated }): User {
        return new User($key, dateCreated);
    }

    static fromJsonList(users): User[] {
        return users.map(User.fromJson);
    }
}

export class List {
    constructor(
        public $key: string,
        public name: string,
        public isActive: boolean,
        public dateCreated: string
    ) { }

    static fromJson({ $key, name, isActive, dateCreated }): List {
        return new List($key, name, isActive, dateCreated);
    }

    static fromJsonList(lists): List[] {
        return lists.map(List.fromJson);
    }
}

export class Recipe {
    constructor(
        public $key: string,
        public name: string,
        public isActive: boolean,
        public dateCreated: string
    ) { }

    static fromJson({ $key, name, isActive, dateCreated }): Recipe {
        return new Recipe($key, name, isActive, dateCreated);
    }

    static fromJsonList(recipes): Recipe[] {
        return recipes.map(Recipe.fromJson);
    }
}

export class Item {
    constructor(
        public $key: string,
        public name: string,
        public categoryId: string
    ) { }

    static fromJson({ $key, name, categoryId }): Item {
        return new Item($key, name, categoryId);
    }

    static fromJsonList(items): Item[] {
        return items.map(Item.fromJson);
    }
}

export class ListItem {
    constructor(
        public $key: string,
        public itemId: string,
        public itemName: string,
        public categoryId: string,
        public categoryName: string,
        public quantity: number,
        public isCompleted: boolean
    ) {}

    static fromJson({ $key, itemId, quantity, isCompleted, itemName, categoryId, categoryName }): ListItem {
        return new ListItem($key, itemId, quantity, isCompleted, itemName, categoryId, categoryName);
    }

    static fromJsonList(listItems): ListItem[] {
        return listItems.map(ListItem.fromJson);
    }}

export class ItemPurchase {
    constructor(
        public $key: string,
        public cost: string,
        public vendorId: string,
        public dateOfPurchase: string
    ) {}

    static fromJson({ $key, cost, vendorId, dateOfPurchase }): ItemPurchase {
        return new ItemPurchase($key, cost, vendorId, dateOfPurchase);
    }

    static fromJsonList(itemPurchases): ItemPurchase[] {
        return itemPurchases.map(ItemPurchase.fromJson);
    }}

export class Category {
    constructor(
        public $key: string,
        public name: string,
        public isActive: boolean
    ) {}

    static fromJson({ $key, name, isActive }): Category {
        return new Category($key, name, isActive);
    }

    static fromJsonList(categories): Category[] {
        return categories.map(Category.fromJson);
    }}

export class Vendor {
    constructor(
        public $key: string,
        public name: string,
        public isActive: boolean
    ) {}

    static fromJson({ $key, name, isActive }): Vendor {
        return new Vendor($key, name, isActive);
    }

    static fromJsonList(vendors): Vendor[] {
        return vendors.map(Vendor.fromJson);
    }}