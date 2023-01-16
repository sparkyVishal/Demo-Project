import Joi from "joi";

const productSchema = Joi.object({
    // name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    offer_price: Joi.number().required(),
    discount: Joi.string().required(), 
    category: Joi.string().required(),

});

export default productSchema;