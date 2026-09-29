import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, default: 'Hero Slide' },
    altText: { type: String, default: '', trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    order: { type: Number, required: true, min: 1, default: 1 }
  },
  { timestamps: true }
);

export const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);