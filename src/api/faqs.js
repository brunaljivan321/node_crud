/* eslint-disable consistent-return */
const express = require('express');
const monk = require('monk');
const Joi = require('joi');

const db = monk(process.env.MONGO_URI);
const faqs = db.get('faqs');

const schema = Joi.object({
  question: Joi.string().trim().required(),
  answer: Joi.string().trim().required(),
  video_url: Joi.string(),
});

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await faqs.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await faqs.findOne({
      _id: id,
    });
    if (!item) return next();
    return res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const faq = req.body;
    await schema.validateAsync(faq);
    const inserted = await faqs.insert(faq);
    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = req.body;
    await schema.validateAsync(faq);
    const item = await faqs.findOne({
      _id: id,
    });
    if (!item) return next();
    await faqs.update({
      _id: id,
    }, {
      $set: faq
    });
    return res.json(faq);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await faqs.findOne({
      _id: id,
    });
    if (!item) return next();
    await faqs.remove({
      _id: id,
    });
    res.json({
      message: 'Success'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
