import express from 'express';
import multer from 'multer'
import ProductModel from '../modal/product';
const path = require('path')

const storage=multer.diskStorage({
    destination:(req:any,res:any,cb:any)=>{
        cb(null,"./src/upload/images")
    },
    filename:(req:any,res:any,cb:any)=>{
        return cb(null,`${res.fieldname}_${Date.now()}${path.extname(res.originalname)}`)  //
    }
   

})
const upload=multer({
    storage:storage,
})



const router = express.Router()
router.get('/', (req: any, res: any, next: any) => {
    try {
        ProductModel.find().then((data) => {
            res.json(data);
        });
    } catch (err) {
        next(err);
    }
});

router.post('/addproduct', upload.array('photos', 10), (req: any, res: any, next: any) => {
    try {
        const product = req.body;
        var url:any[]=[]
        req.files.forEach((element:any) => {
            url.push(element.filename)
        });
        
        ProductModel.findOne({ name: product.name }).then((data) => {
            if (data) {
                const result = {
                    message: "Product Already exist",
                    result: data
                }
                res.json(result)
            }
            else {
                const tax=Number(product.price)+(( Number(product.price) / 100 ) * 18)
        const discountedPrice=tax-(tax/100)*Number(product.discount)
                
                ProductModel.insertMany([{
                    "name": product.name,
                    "description": product.description,
                    "mrp": discountedPrice,
                    "url":url,
                    "discount":(tax/100)*product.discount,
                    "price":product.price,
                    "shipping":product.shipping,
                    "total":discountedPrice+product.shipping

                }]).then((data) => {
                    const result = {
                        message: "product added successfull",
                        result: data
                    }
                    res.json(result)
                });
            }
        });

    } catch (err) {
        next(err);
    }
})
router.put('/update/:name',upload.array('photos', 10),(req: any, res: any, next:any)=>{
    try {
        const name = req.params.name;
        const product = req.body;
        var url:any[]=[]
        req.files.forEach((element:any) => {
            url.push(element.filename)
        });
        const tax=Number(product.price)+(( Number(product.price) / 100 ) * 18)
        const discountedPrice=tax-(tax/100)*Number(product.discount)

        const total=discountedPrice+Number(product.shipping)
        const discount=(tax/100)*Number(product.discount)
        ProductModel.updateOne(
            { name },
            {
                    name: product.productname,
                    description: product.description,
                    mrp: discountedPrice,
                    url:url,
                    discount,
                    price:product.price,
                    shipping:product.shipping,
                    total
            }
        ).then((data) => {
            res.json(data);
        });
    } catch (err) {
        next(err);
    }
})
router.delete('/delete/:name', (req: any, res: any, next: any) => {
    try {
        const item = req.params;
        ProductModel.deleteOne({ name: item.name })
            .then((result) => {
                res.json(result);
            })

    } catch (err) {
        next(err);
    }
})


export default router;