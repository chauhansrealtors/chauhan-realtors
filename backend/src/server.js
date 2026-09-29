import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'node:url';

import { connectDatabase } from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import enquiryRoutes from './routes/enquiry.routes.js';
import healthRoutes from './routes/health.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import seoRoutes from './routes/seo.routes.js';

import { Blog } from './models/Blog.js';
import { Project } from './models/Project.js';
import { Property } from './models/Property.js';
import { Service } from './models/Service.js';
import { Testimonial } from './models/Testimonial.js';
import { Category } from './models/Category.js';
import { HeroSlide } from './models/HeroSlide.js';

import { createContentRouter } from './routes/contentCrud.js';
import categoryRoutes from './routes/category.routes.js';
import heroSlideRoutes from './routes/heroSlide.routes.js';

const app = express();

const port = Number(process.env.PORT) || 5000;
const robotsFilePath = fileURLToPath(new URL('../public/robots.txt', import.meta.url));

/* -------------------------------------------------------
   CORS
------------------------------------------------------- */

const configuredFrontendOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set(
  [
    ...configuredFrontendOrigins,

    // Local development
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',

    // Current Vercel frontend URLs
    'https://realestatewebsite-delta.vercel.app',
    'https://realestatewebsite-prinsiaghera2611-2072s-projects.vercel.app',
  ].filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/* -------------------------------------------------------
   Middleware
------------------------------------------------------- */

app.use(express.json());

app.get('/robots.txt', (_req, res) => res.type('text/plain').sendFile(robotsFilePath));

let databasePromise;

async function initializeDatabase() {
  if (!databasePromise) {
    databasePromise = connectDatabase().then(async () => {
      if (!(await HeroSlide.exists({}))) {
        await HeroSlide.insertMany([
          { image: '/1f9cee63-23c1-42b1-95dc-823c4deeed7d.jpg', title: 'Hero Slide 1', altText: 'Chauhan Realtors luxury real estate cityscape', status: 'active', order: 1 },
          { image: '/developers/c-01.jpeg', title: 'Hero Slide 2', altText: 'Modern residential tower with landscaped grounds', status: 'active', order: 2 }
        ]);
      }

      await Category.bulkWrite([
        { updateOne: { filter: { name: 'Commercial' }, update: { $setOnInsert: { name: 'Commercial', slug: 'commercial', status: 'active' } }, upsert: true } },
        { updateOne: { filter: { name: 'Residential' }, update: { $setOnInsert: { name: 'Residential', slug: 'residential', status: 'active' } }, upsert: true } }
      ]);
    }).catch((error) => {
      databasePromise = undefined;
      throw error;
    });
  }

  await databasePromise;
}

app.use(async (_req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    console.error(`Database connection failed: ${message}`);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

/* -------------------------------------------------------
   Health
------------------------------------------------------- */

app.use(seoRoutes);

app.use('/api/health', healthRoutes);

/* -------------------------------------------------------
   Authentication
------------------------------------------------------- */

app.use('/api/auth', authRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/hero-slides', heroSlideRoutes);

/* -------------------------------------------------------
   Uploads
------------------------------------------------------- */

const uploadRoot = fileURLToPath(
  new URL('../uploads/', import.meta.url)
);

app.use('/uploads', express.static(uploadRoot));
app.use('/api/uploads', uploadRoutes);

/* -------------------------------------------------------
   Projects
------------------------------------------------------- */

app.use(
  '/api/projects',
  createContentRouter(Project, { slug: true })
);

/* -------------------------------------------------------
   Properties
------------------------------------------------------- */

app.use(
  '/api/properties',
  createContentRouter(Property, { slug: true })
);

/* -------------------------------------------------------
   Blogs
------------------------------------------------------- */

app.use(
  '/api/blogs',
  createContentRouter(Blog, { slug: true })
);

/* -------------------------------------------------------
   Testimonials
------------------------------------------------------- */

app.use(
  '/api/testimonials',
  createContentRouter(Testimonial)
);

/* -------------------------------------------------------
   Services
------------------------------------------------------- */

app.use(
  '/api/services',
  createContentRouter(Service)
);

/* -------------------------------------------------------
   Enquiries
------------------------------------------------------- */

app.use('/api/enquiries', enquiryRoutes);

/* -------------------------------------------------------
   Content
------------------------------------------------------- */

app.use('/api/content', contentRoutes);

/* -------------------------------------------------------
   Dashboard
------------------------------------------------------- */

app.use('/api/dashboard', dashboardRoutes);

/* -------------------------------------------------------
   Local development server
------------------------------------------------------- */

if (!process.env.VERCEL) {
  initializeDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(
          `Server running on http://localhost:${port}`
        );
      });
    })
    .catch((error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown database error';

      console.error(
        `Database connection failed: ${message}`
      );

      process.exit(1);
    });
}

/* -------------------------------------------------------
   Export Express app for Vercel
------------------------------------------------------- */

export default app;