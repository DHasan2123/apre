/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /channel-rating-by-month
 *
 * Fetches average customer feedback ratings by channel for a specified month.
 *
 * Example:
 * fetch('/channel-rating-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/channel-rating-by-month', (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return next(createError(400, 'month and channel are required'));
    }

    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        {
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          $group: {
            _id: {
              channel: "$channel",
              month: { $month: "$date" },
            },
            ratingAvg: { $avg: '$rating'}
          }
        },
        {
          $match: {
            '_id.month': Number(month)
          }
        },
        {
          $group: {
            _id: '$_id.channel',
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channel: '$_id',
            ratingAvg: 1
          }
        },
        {
          $group: {
            _id: null,
            channels: { $push: '$channel' },
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channels: 1,
            ratingAvg: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error in /rating-by-date-range-and-channel', err);
    next(err);
  }
});


router.get('/feedback-by-month', (req, res, next) => {
  try {
    const month = req.query.month;

    if (!month) {
      return res.status(400).send('Month parameter is missing');
    }

    mongo(async db => {
      const feedbackByMonth = await db.collection('customerFeedback').aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $month: '$feedbackDate' }, parseInt(month)]
            }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            month: { $dateToString: { format: '%B', date: '$feedbackDate' } },
            region: 1,
            category: 1,
            channel: 1,
            customer: 1,
            salesperson: 1,
            feedbackType: 1,
            feedbackText: 1,
            feedbackSource: 1,
            feedbackStatus: 1
          }
        }
      ]).toArray();

      res.send(feedbackByMonth);
    }, next);

  } catch (err) {
    console.error('Error getting feedback data by month: ', err);
    next(err);
  }
});

module.exports = router;
