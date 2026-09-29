import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/authMiddleware.js';
import { HeroSlide } from '../models/HeroSlide.js';

const router = Router();

function normalizeStatus(value) {
  return value === 'inactive' ? 'inactive' : 'active';
}

function validOrder(value) {
  const order = Number(value);
  return Number.isInteger(order) && order > 0 ? order : null;
}

async function normalizeOrders() {
  const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1, _id: 1 }).select('_id');
  if (slides.length === 0) return;
  await HeroSlide.bulkWrite(slides.map((slide, index) => ({
    updateOne: { filter: { _id: slide._id }, update: { $set: { order: index + 1 } } }
  })));
}

router.get('/', async (_req, res) => {
  try {
    const slides = await HeroSlide.find({ status: 'active' }).sort({ order: 1, createdAt: 1, _id: 1 });
    return res.json({ success: true, data: slides });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to load hero slides.' });
  }
});

router.get('/admin/all', requireAuth, async (_req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1, _id: 1 });
    return res.json({ success: true, data: slides });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to load hero slides.' });
  }
});

router.patch('/reorder', requireAuth, async (req, res) => {
  const orderedIds = req.body?.orderedIds;
  if (!Array.isArray(orderedIds) || orderedIds.some((id) => !mongoose.isValidObjectId(id))) {
    return res.status(400).json({ success: false, message: 'A valid slide order is required.' });
  }

  try {
    const existingSlides = await HeroSlide.find().select('_id');
    const existingIds = new Set(existingSlides.map((slide) => String(slide._id)));
    if (orderedIds.length !== existingIds.size || new Set(orderedIds).size !== existingIds.size || orderedIds.some((id) => !existingIds.has(id))) {
      return res.status(400).json({ success: false, message: 'The order must include every hero slide exactly once.' });
    }

    await HeroSlide.bulkWrite(orderedIds.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index + 1 } } }
    })));
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1, _id: 1 });
    return res.json({ success: true, data: slides });
  } catch {
    return res.status(400).json({ success: false, message: 'Unable to reorder hero slides.' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Hero slide not found.' });
  }

  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ success: false, message: 'Hero slide not found.' });
    return res.json({ success: true, data: slide });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to load hero slide.' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const image = String(req.body?.image || '').trim();
  if (!image) return res.status(400).json({ success: false, message: 'Please select a hero image.' });

  const requestedOrder = req.body?.order;
  const highestOrder = requestedOrder === undefined || requestedOrder === ''
    ? await HeroSlide.findOne().sort({ order: -1 }).select('order').lean()
    : null;
  const order = highestOrder ? highestOrder.order + 1 : requestedOrder === undefined || requestedOrder === '' ? 1 : validOrder(requestedOrder);
  if (!order) return res.status(400).json({ success: false, message: 'Order must be a positive whole number.' });

  try {
    const slide = await HeroSlide.create({
      image,
      title: String(req.body?.title || '').trim() || `Hero Slide ${order}`,
      altText: String(req.body?.altText || '').trim(),
      status: normalizeStatus(req.body?.status),
      order
    });
    return res.status(201).json({ success: true, data: slide });
  } catch {
    return res.status(400).json({ success: false, message: 'Unable to create hero slide.' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Hero slide not found.' });
  }

  try {
    const existingSlide = await HeroSlide.findById(req.params.id);
    if (!existingSlide) return res.status(404).json({ success: false, message: 'Hero slide not found.' });

    const updates = {};
    const image = String(req.body?.image || '').trim();
    if (image) updates.image = image;
    if (req.body?.title !== undefined) updates.title = String(req.body.title).trim() || existingSlide.title;
    if (req.body?.altText !== undefined) updates.altText = String(req.body.altText).trim();
    if (req.body?.status !== undefined) updates.status = normalizeStatus(req.body.status);
    if (req.body?.order !== undefined && req.body.order !== '') {
      const order = validOrder(req.body.order);
      if (!order) return res.status(400).json({ success: false, message: 'Order must be a positive whole number.' });
      updates.order = order;
    }

    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!slide) return res.status(404).json({ success: false, message: 'Hero slide not found.' });
    return res.json({ success: true, data: slide });
  } catch {
    return res.status(400).json({ success: false, message: 'Unable to update hero slide.' });
  }
});

router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, {
      status: normalizeStatus(req.body?.status)
    }, { new: true, runValidators: true });
    if (!slide) return res.status(404).json({ success: false, message: 'Hero slide not found.' });
    return res.json({ success: true, data: slide });
  } catch {
    return res.status(400).json({ success: false, message: 'Unable to update hero slide status.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Hero slide not found.' });
  }

  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ success: false, message: 'Hero slide not found.' });
    await normalizeOrders();
    return res.json({ success: true });
  } catch {
    return res.status(400).json({ success: false, message: 'Unable to delete hero slide.' });
  }
});

router.use((_req, res) => res.status(404).json({ success: false, message: 'Hero slide endpoint not found.' }));

export default router;