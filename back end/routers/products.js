const express = require('express');
const {Product} = require("../models/product");
const {Category} = require("../models/Category");
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/`, async (req, res) =>{
    let filter = {};
    if(req.query.categories)
    {
        filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');

    if(!productList) {
        res.status(500).json({success: false})
    }
    res.send(productList);
})

router.get(`/:id`, async (req, res) =>{
    const product = await Product.findById(req.params.id).populate('category');
    if(!product) {
        res.status(500).json({success: false})
    }
    res.send(product);
})

router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    let product = new Product ({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        richDescription: req.body.richDescription,
        images: req.body.images,
        brand: req.body.brand,
        price:req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        countInStock: req.body.countInStock
    })

    product = await product.save();

    if(!product)
    return res.status(500).send('The product cannot be created')

    res.send(product);

})

router.put('/:id', async (req, res) =>{
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product id')
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')
    const product = await Product.findByIdAndUpdate(

        req.params.id,
        {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            richDescription: req.body.richDescription,
            images: req.body.images,
            brand: req.body.brand,
            price:req.body.price,
            category: req.body.category,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            countInStock: req.body.countInStock
        },
        {new: true}
    )
    if (!product)
        return res.status(500).send('Product cannot be updated')

    res.send(product);
})

router.delete('/:id', (req, res) =>{
    Product.findByIdAndDelete(req.params.id).then(product => {
        if(product) {
            return res.status(200).json({success: true, message: 'The product is deleted'})
        } else {
            return res.status(404).json({success: false, message: "product not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

router.get(`/get/count`, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();

        if (productCount === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        res.status(200).send({
            productCount: productCount,
        });
    } catch (err) {
        console.error('Error getting product count:', err.message);
        res.status(500).json({ success: false, message: "Error retrieving product count" });
    }
});

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count);
    if(!products) {
        res.status(500).json({success:false})
    }
    res.send(products);
});



module.exports = router;