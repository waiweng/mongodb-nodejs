const database = 'inventory'
const collection = 'products'

use(database);
db.products.drop();
db.createCollection(collection);

const productsData = [
    {name: "Smartphone", price: 499.99, category: "Electronics", description: " A high-end smartphone with long battery life", inStock: true},
    {name: "Laptop", price: 899.99, category: "Electronics", description: " A powerful laptop great for work and personal use",inStock: true},
    {name: "Running Shoes", price: 89.99, category: "Sports", description: "Comfortable and lightweight sport shoes",inStock: true},
    {name: "Wireless Earbuds", price: 79.99, category: "Electronics", description: " True wireless earbuds great for indoor and outdoor use", inStock: false},
    {name: "Dress Shirt", price: 49.95, category: "Fashion", description: " A stylish dress shirt suitable for outdoor" ,inStock: true},
    {name: "Yoga Mat", price: 29.99, category: "Sports", description: " A non-slip yoga mat for comfortable exercise", inStock: false},
    {name: "Coffee Maker", price: 69.95, category: "Applicances", description: " A programmable coffee maker that makes coffee like a pro", inStock: false},
    {name: "Digital Camera", price: 349.99, category: "Electronics", description: " A high-resolution digital camera suitables to take panoramic pictures", inStock: true},
];

db.products.insertMany(productsData);

console.log(`${database}.${collection} has ${db.products.countDocuments()} documents.`);

db.products.find({inStock: true})