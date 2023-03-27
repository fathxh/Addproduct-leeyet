import mongoose from "mongoose";

const model = mongoose.model;
const schema = mongoose.Schema;

//creating a schema to store all data in same format
const productSchema = new schema({
    name: String,
    description: String,
    price: Number,
    url: Array,
    mrp:Number,
    discount:Number,
    shipping:Number,
    total:Number
});

export default model('Product', productSchema);