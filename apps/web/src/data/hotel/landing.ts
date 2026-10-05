/**
 * Marketing copy for the Hotel Management landing page demo. Static, fictional content: the hotel "Hôtel Azure" is a sample property,
 * and its rooms, guests and reviews are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const HOTEL_BRAND = { name: 'AZURE', tagline: 'Luxury hotel & resort' } as const;

export const LANDING_NAV = [
  { label: 'Rooms', href: '#rooms' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Offers', href: '#offers' },
  { label: 'Location', href: '#location' },
  { label: 'Book now', href: '#book' },
] as const;

export type FeatureIcon = 'booking' | 'rooms' | 'guests' | 'reservations' | 'payments' | 'housekeeping' | 'staff' | 'analytics';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'booking', title: 'Online Booking', description: 'Guests book the room they want, at the rate they see, with no double bookings.' },
  { icon: 'rooms', title: 'Room Management', description: 'A live view of every room: status, category, rates and what needs attention next.' },
  { icon: 'guests', title: 'Guest Management', description: 'Profiles, preferences and stay history, so every return feels personal.' },
  { icon: 'reservations', title: 'Reservation System', description: 'A calendar that prevents clashes, with reminders and easy amendments.' },
  { icon: 'payments', title: 'Payment Management', description: 'Deposits, folios and invoices in one place, with secure card and wallet payments.' },
  { icon: 'housekeeping', title: 'Housekeeping', description: 'Cleaning status and tasks shared between front desk and the housekeeping team.' },
  { icon: 'staff', title: 'Staff Management', description: 'Rosters, shifts and task tracking for every team, from concierge to kitchen.' },
  { icon: 'analytics', title: 'Analytics', description: 'Occupancy, rates and revenue per room, so decisions are made on real numbers.' },
];

export const ROOMS_PUBLIC: { name: string; from: number; size: string; blurb: string; features: string[]; tone: string }[] = [
  { name: 'Deluxe Room', from: 260, size: '32–36 m²', blurb: 'Calm, considered comfort with a rain shower and garden or city views.', features: ['King bed', 'Rain shower', 'Espresso bar'], tone: 'bg-[#f5f1eb]' },
  { name: 'Suite', from: 520, size: '68–96 m²', blurb: 'A separate lounge, a private terrace and a butler at your call.', features: ['Lounge & terrace', 'Butler service', 'Panoramic views'], tone: 'bg-[#eef2f6]' },
  { name: 'Family Room', from: 400, size: '56–62 m²', blurb: 'Room for everyone, with a kids corner and adjoining bathrooms.', features: ['Two bathrooms', 'Kids corner', 'Garden views'], tone: 'bg-[#f1f5f3]' },
];

export const FACILITIES_PUBLIC = [
  { name: 'Infinity pool', blurb: 'Heated, with a view over the harbour.' },
  { name: 'Spa & wellness', blurb: 'Treatments, sauna and a hydrotherapy circuit.' },
  { name: 'Fine dining', blurb: 'Seasonal menus from a chef-led kitchen.' },
  { name: 'Rooftop bar', blurb: 'Cocktails and sunsets, open until late.' },
];

export const TESTIMONIALS: { quote: string; name: string; city: string }[] = [
  { quote: 'Every detail was anticipated, from the pillows to the view we had been hoping for. We are already planning our return.', name: 'Hannah Lindqvist', city: 'Stockholm' },
  { quote: 'The suite felt like a private home. The concierge arranged a table within minutes of asking.', name: 'Marcus Reed', city: 'Chicago' },
  { quote: 'Our children still talk about the pool. The family room was spacious, calm and beautifully kept.', name: 'Sofia Alvarez', city: 'Madrid' },
];

export const OFFERS_PUBLIC = [
  { title: 'Stay 3, pay 2', detail: 'Three nights in any suite, the third on us.', code: 'STAY3' },
  { title: 'Spa & dine', detail: 'Free spa access and dinner for stays over four nights.', code: 'SPADINE' },
  { title: 'Early booker', detail: '15% off when you book 60 days ahead, direct.', code: 'EARLY15' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '4.9', label: 'Guest rating' },
  { value: '96%', label: 'Guests who return' },
  { value: '24 h', label: 'Concierge service' },
  { value: '1958', label: 'Serving since' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Stay', links: ['Rooms', 'Suites', 'Offers', 'Gift cards'] },
  { title: 'Hotel', links: ['Facilities', 'Dining', 'Events', 'Location'] },
  { title: 'Help', links: ['Contact', 'Cancellations', 'Accessibility', 'Privacy'] },
];

export const LOCATION = {
  address: '24 Harbour Promenade, Old Town',
  blurb: 'Ten minutes from the old town square, a short walk from the ferry terminal and the cultural district.',
  distances: [
    ['Old town square', '6 min walk'],
    ['Ferry terminal', '4 min walk'],
    ['International airport', '25 min drive'],
  ] as const,
};
