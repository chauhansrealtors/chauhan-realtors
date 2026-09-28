export const brand = {
  name: 'Chauhan Realtors',
  tagline: 'Building Trust, Creating Future',
  logo: "/logo_c-removebg-preview.png",
  founder: {
    name: 'Dharmendra Pratap Singh',
    role: 'Founder, Chauhan Realtors',
    designation: 'Founder',
    photo: "/image-1.png",
    phone: '9625868606',
    phoneDisplay: '+91 96258 68606'
  },
  whatsapp: { number: '919625868606', display: '+91 96258 68606' },
  email: 'Info@chauhanrealtors.in',
  office: {
    lines: ['SVH Metro Street', 'Sector 84, Gurgaon'],
    mapQuery: 'SVH Metro Street, Sector 84, Gurgaon'
  },
  social: [
  { label: 'Facebook', handle: 'Chauhans Realtors', href: 'https://www.facebook.com/Chauhansrealtors' },
  { label: 'Instagram', handle: '@chauhanerealtors2023', href: 'https://www.instagram.com/chauhanerealtors2023' },
  { label: 'LinkedIn', handle: 'Chauhan Realtors', href: 'https://www.linkedin.com/company/chauhan-realtors/' }]

};

export const navigation = [
{ label: 'Home', to: '/' },
{ label: 'Projects', to: '/properties' },
{ label: 'About', to: '/about' },
{ label: 'Services', to: '/services' },
{ label: 'Blog', to: '/blog' },
{ label: 'Contact', to: '/contact' }];


export const GENERAL_WHATSAPP_MESSAGE =
'Hello Chauhan Realtors, I am interested in your property projects. Please share more details.';

export const whatsappLink = (message: string = GENERAL_WHATSAPP_MESSAGE) =>
'https://wa.me/' + brand.whatsapp.number + '?text=' + encodeURIComponent(message);

export const projectWhatsappMessage = (name: string) =>
'Hello Chauhan Realtors, I am interested in ' +
name +
'. Please share the latest details, availability and site visit information.';

export const siteVisitMessage = (name: string) =>
'Hello Chauhan Realtors, I would like to schedule a site visit for ' +
name +
'. Please share available slots.';

export const brochureMessage = (name: string) =>
'Hello Chauhan Realtors, please share the brochure and latest details for ' + name + '.';

export const callLink = (phone: string) => 'tel:' + phone;

export const mailLink = (subject = 'Property enquiry - Chauhan Realtors') =>
'mailto:' + brand.email + '?subject=' + encodeURIComponent(subject);

export const mapsDirectionsLink =
'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(brand.office.mapQuery);

export const DISCLAIMER_SHORT =
'Property information, pricing, availability, specifications, floor plans, images and amenities are subject to change and should be independently verified with the respective developer/promoter before making any investment or purchase decision.';

export const DISCLAIMER_VISUALS =
'Images and visuals may be artistic representations and may differ from the final development.';