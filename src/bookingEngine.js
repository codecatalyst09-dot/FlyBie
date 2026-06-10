// FlyBie Booking Engine
// Resolves NER slots, PII protection, date conversions, and mock searches.

export const CITIES = [
  { name: 'Mumbai', code: 'BOM', synonyms: ['mumbai', 'bom', 'bombay'] },
  { name: 'Dubai', code: 'DXB', synonyms: ['dubai', 'dxb'] },
  { name: 'Delhi', code: 'DEL', synonyms: ['delhi', 'del', 'new delhi'] },
  { name: 'Singapore', code: 'SIN', synonyms: ['singapore', 'sin', 'changi'] },
  { name: 'London', code: 'LHR', synonyms: ['london', 'lhr', 'heathrow'] },
  { name: 'New York', code: 'JFK', synonyms: ['new york', 'jfk', 'nyc', 'kennedy'] }
];

export const CABIN_CLASSES = [
  { name: 'Economy', synonyms: ['economy', 'coach', 'eco', 'standard'] },
  { name: 'Premium Economy', synonyms: ['premium economy', 'premium eco', 'pe'] },
  { name: 'Business', synonyms: ['business', 'biz', 'executive'] },
  { name: 'First', synonyms: ['first class', 'first', 'suite'] }
];

// Mock flight database with 24 sample flights between BOM, DXB, DEL, SIN, LHR, JFK
export const mockFlights = [
  // BOM - DXB
  { id: 'F001', flightNumber: 'FB-101', airline: 'FlyBie Airlines', origin: 'BOM', destination: 'DXB', departureTime: '06:30', arrivalTime: '08:15', duration: '3h 15m', basePrice: 280, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 'F002', flightNumber: 'EK-507', airline: 'Emirates', origin: 'BOM', destination: 'DXB', departureTime: '15:45', arrivalTime: '17:30', duration: '3h 15m', basePrice: 350, days: [0, 2, 4, 6] },
  { id: 'F003', flightNumber: 'FB-103', airline: 'FlyBie Airlines', origin: 'BOM', destination: 'DXB', departureTime: '22:15', arrivalTime: '00:05', duration: '3h 20m', basePrice: 240, days: [0, 1, 2, 3, 4, 5, 6] },

  // DXB - BOM
  { id: 'F004', flightNumber: 'FB-102', airline: 'FlyBie Airlines', origin: 'DXB', destination: 'BOM', departureTime: '09:30', arrivalTime: '14:15', duration: '3h 15m', basePrice: 290, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 'F005', flightNumber: 'EK-508', airline: 'Emirates', origin: 'DXB', destination: 'BOM', departureTime: '18:20', arrivalTime: '23:05', duration: '3h 15m', basePrice: 340, days: [1, 3, 5, 6] },

  // DEL - SIN
  { id: 'F006', flightNumber: 'FB-301', airline: 'FlyBie Airlines', origin: 'DEL', destination: 'SIN', departureTime: '08:45', arrivalTime: '16:55', duration: '5h 40m', basePrice: 390, days: [0, 1, 3, 5, 6] },
  { id: 'F007', flightNumber: 'SQ-403', airline: 'Singapore Airlines', origin: 'DEL', destination: 'SIN', departureTime: '21:50', arrivalTime: '06:10', duration: '5h 50m', basePrice: 480, days: [0, 2, 4, 5, 6] },

  // SIN - DEL
  { id: 'F008', flightNumber: 'FB-302', airline: 'FlyBie Airlines', origin: 'SIN', destination: 'DEL', departureTime: '12:00', arrivalTime: '15:15', duration: '5h 45m', basePrice: 380, days: [0, 1, 3, 5, 6] },

  // BOM - LHR
  { id: 'F009', flightNumber: 'FB-501', airline: 'FlyBie Airlines', origin: 'BOM', destination: 'LHR', departureTime: '02:15', arrivalTime: '07:30', duration: '9h 45m', basePrice: 650, days: [0, 2, 4, 6] },
  { id: 'F010', flightNumber: 'BA-138', airline: 'British Airways', origin: 'BOM', destination: 'LHR', departureTime: '13:10', arrivalTime: '18:25', duration: '9h 45m', basePrice: 720, days: [0, 1, 2, 3, 4, 5, 6] },

  // LHR - BOM
  { id: 'F011', flightNumber: 'FB-502', airline: 'FlyBie Airlines', origin: 'LHR', destination: 'BOM', departureTime: '10:00', arrivalTime: '23:35', duration: '9h 05m', basePrice: 630, days: [0, 2, 4, 6] },

  // JFK - LHR
  { id: 'F012', flightNumber: 'BA-178', airline: 'British Airways', origin: 'JFK', destination: 'LHR', departureTime: '09:00', arrivalTime: '21:10', duration: '7h 10m', basePrice: 450, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 'F013', flightNumber: 'FB-701', airline: 'FlyBie Airlines', origin: 'JFK', destination: 'LHR', departureTime: '20:30', arrivalTime: '08:40', duration: '7h 10m', basePrice: 420, days: [0, 1, 2, 3, 4, 5, 6] },

  // LHR - JFK
  { id: 'F014', flightNumber: 'FB-702', airline: 'FlyBie Airlines', origin: 'LHR', destination: 'JFK', departureTime: '11:15', arrivalTime: '14:20', duration: '8h 05m', basePrice: 460, days: [0, 1, 2, 3, 4, 5, 6] },

  // BOM - DEL
  { id: 'F015', flightNumber: 'FB-011', airline: 'FlyBie Airlines', origin: 'BOM', destination: 'DEL', departureTime: '06:00', arrivalTime: '08:10', duration: '2h 10m', basePrice: 85, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 'F016', flightNumber: 'FB-012', airline: 'FlyBie Airlines', origin: 'BOM', destination: 'DEL', departureTime: '18:45', arrivalTime: '21:00', duration: '2h 15m', basePrice: 95, days: [0, 1, 2, 3, 4, 5, 6] },

  // DEL - BOM
  { id: 'F017', flightNumber: 'FB-015', airline: 'FlyBie Airlines', origin: 'DEL', destination: 'BOM', departureTime: '09:15', arrivalTime: '11:30', duration: '2h 15m', basePrice: 85, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 'F018', flightNumber: 'FB-016', airline: 'FlyBie Airlines', origin: 'DEL', destination: 'BOM', departureTime: '21:30', arrivalTime: '23:45', duration: '2h 15m', basePrice: 90, days: [0, 1, 2, 3, 4, 5, 6] },

  // SIN - DXB
  { id: 'F019', flightNumber: 'SQ-494', airline: 'Singapore Airlines', origin: 'SIN', destination: 'DXB', departureTime: '15:10', arrivalTime: '18:40', duration: '7h 30m', basePrice: 510, days: [1, 3, 5, 7] },
  { id: 'F020', flightNumber: 'FB-451', airline: 'FlyBie Airlines', origin: 'SIN', destination: 'DXB', departureTime: '23:05', arrivalTime: '02:30', duration: '7h 25m', basePrice: 440, days: [0, 1, 2, 3, 4, 5, 6] },

  // DXB - SIN
  { id: 'F021', flightNumber: 'FB-452', airline: 'FlyBie Airlines', origin: 'DXB', destination: 'SIN', departureTime: '09:15', arrivalTime: '21:00', duration: '7h 45m', basePrice: 450, days: [0, 1, 2, 3, 4, 5, 6] },

  // JFK - DXB
  { id: 'F022', flightNumber: 'EK-202', airline: 'Emirates', origin: 'JFK', destination: 'DXB', departureTime: '23:00', arrivalTime: '19:45', duration: '12h 45m', basePrice: 950, days: [0, 1, 2, 3, 4, 5, 6] },

  // DXB - JFK
  { id: 'F023', flightNumber: 'EK-201', airline: 'Emirates', origin: 'DXB', destination: 'JFK', departureTime: '08:30', arrivalTime: '14:15', duration: '13h 45m', basePrice: 980, days: [0, 1, 2, 3, 4, 5, 6] },

  // BOM - SIN
  { id: 'F024', flightNumber: 'FB-331', airline: 'FlyBie Airlines', origin: 'BOM', destination: 'SIN', departureTime: '01:45', arrivalTime: '09:50', duration: '5h 35m', basePrice: 320, days: [1, 3, 5, 7] }
];

// Helper to check if a word matches a city
function matchCity(word) {
  const cleaned = word.toLowerCase().trim().replace(/[^a-z\s]/g, '');
  for (const city of CITIES) {
    if (city.synonyms.includes(cleaned) || city.name.toLowerCase() === cleaned) {
      return city;
    }
  }
  return null;
}

export function getAirportCode(cityOrCode) {
  if (!cityOrCode) return null;
  const cleaned = cityOrCode.toLowerCase().trim().replace(/[^a-z\s]/g, '');
  for (const city of CITIES) {
    if (city.code.toLowerCase() === cleaned || city.name.toLowerCase() === cleaned || city.synonyms.includes(cleaned)) {
      return city.code;
    }
  }
  return null;
}

// Convert a number word to integer
function parseNumberWord(word) {
  const numberWords = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'single': 1, 'solo': 1, 'couple': 2, 'just me': 1, 'alone': 1
  };
  return numberWords[word.toLowerCase().trim()] || null;
}

// Resolves relative and absolute dates
// Base Date is anchored to 2026-06-11 (Thursday)
export function parseNaturalDate(dateStr, baseDateStr = '2026-06-11') {
  if (!dateStr) return null;
  const baseDate = new Date(baseDateStr + 'T00:00:00');
  const normalized = dateStr.toLowerCase().trim();

  // 1. Basic relative words
  if (normalized === 'today') {
    return baseDateStr;
  }
  if (normalized === 'tomorrow') {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  if (normalized === 'day after' || normalized === 'day after tomorrow') {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + 2);
    return d.toISOString().split('T')[0];
  }

  // 2. Day of Week parsing: e.g. "coming monday", "next friday", "this friday", "on tuesday"
  const daysOfWeek = {
    'sunday': 0, 'sun': 0,
    'monday': 1, 'mon': 1,
    'tuesday': 2, 'tue': 2, 'wednesday': 3, 'wed': 3,
    'thursday': 4, 'thu': 4,
    'friday': 5, 'fri': 5,
    'saturday': 6, 'sat': 6
  };

  // Check if string contains a day name
  let matchedDayNum = -1;
  let matchedDayName = '';
  for (const [name, num] of Object.entries(daysOfWeek)) {
    const rx = new RegExp(`\\b${name}\\b`);
    if (rx.test(normalized)) {
      matchedDayNum = num;
      matchedDayName = name;
      break;
    }
  }

  if (matchedDayNum !== -1) {
    const isNext = normalized.includes('next');
    const isComing = normalized.includes('coming');
    
    const currentDayNum = baseDate.getDay(); // 0 is Sunday, 4 is Thursday (for 2026-06-11)
    let diff = matchedDayNum - currentDayNum;

    // e.g. base date is Thursday (4). We ask for "Friday" (5). Diff is 1.
    // We ask for "Monday" (1). Diff is -3.
    if (diff <= 0) {
      diff += 7; // Target is in the next calendar week cycle
    }

    // Special logic for "next":
    // "next friday" from Thursday (June 11) should mean Friday of next week (June 19), not tomorrow (June 12).
    // If the day is tomorrow/today and they say "next [day]", push it by an extra 7 days.
    if (isNext) {
      if (matchedDayNum === currentDayNum + 1 || matchedDayNum === currentDayNum) {
        diff += 7;
      }
    }

    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + diff);
    return d.toISOString().split('T')[0];
  }

  // 3. Absolute months, e.g. "June 20", "20th June", "July 15th"
  const months = {
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
  };

  let matchedMonth = -1;
  let monthDay = -1;

  // Pattern: "June 25" or "June 25th"
  const p1 = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?\b/;
  const m1 = normalized.match(p1);
  if (m1) {
    matchedMonth = months[m1[1].slice(0, 3)];
    monthDay = parseInt(m1[2]);
  } else {
    // Pattern: "25th June" or "25 June"
    const p2 = /\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/;
    const m2 = normalized.match(p2);
    if (m2) {
      monthDay = parseInt(m2[1]);
      matchedMonth = months[m2[2].slice(0, 3)];
    }
  }

  if (matchedMonth !== -1 && monthDay !== -1) {
    const d = new Date(baseDate.getFullYear(), matchedMonth, monthDay);
    // If the resolved date is before our base date, assume it's next year (2027)
    if (d < baseDate) {
      d.setFullYear(baseDate.getFullYear() + 1);
    }
    return d.toISOString().split('T')[0];
  }

  // 4. ISO Date format: e.g. "2026-06-25"
  const isoMatch = normalized.match(/\b(\d{4})[-/](\d{2})[-/](\d{2})\b/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // Standard slashes, e.g., "12/25/2026" or "25/12/2026"
  // Let's assume standard international DD/MM/YYYY or MM/DD/YYYY depending on layout.
  // We'll support standard DD-MM-YYYY
  const dmMatch = normalized.match(/\b(\d{1,2})[-/](\d{1,2})[-/](\d{4}|\d{2})\b/);
  if (dmMatch) {
    let day = parseInt(dmMatch[1]);
    let month = parseInt(dmMatch[2]) - 1;
    let year = parseInt(dmMatch[3]);
    if (year < 100) year += 2000;
    
    // Simple verification (assuming DD/MM/YYYY)
    if (day > 12 && month < 12) {
      const d = new Date(year, month, day);
      return d.toISOString().split('T')[0];
    } else if (day <= 12 && month < 12) {
      // Ambiguous (could be MM/DD or DD/MM). Default to DD/MM/YYYY for general consistency
      const d = new Date(year, month, day);
      return d.toISOString().split('T')[0];
    }
  }

  return null; // Ambiguous or unrecognized
}

// NER Slot Extraction Logic
export function parseEntities(text, currentSlots = {}) {
  const slots = { ...currentSlots };
  const lowerText = text.toLowerCase();

  // --- 1. Extract Origin & Destination ---
  // Look for "from [City] to [City]" or "[City] to [City]"
  // E.g. "I want to fly from Mumbai to Dubai next Friday"
  const fromToPattern = /\b(?:from|out of|departing|leaving)\s+([a-z\s]+?)\s+(?:to|towards|into)\s+([a-z\s]+?)(?:\s+on|\s+next|\s+this|\s+tomorrow|\s+for|\b)/;
  const directToPattern = /\b([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s+on|\s+next|\s+this|\s+tomorrow|\s+for|\b)/;

  let originFound = null;
  let destFound = null;

  const m1 = lowerText.match(fromToPattern);
  if (m1) {
    const originCity = matchCity(m1[1]);
    const destCity = matchCity(m1[2]);
    if (originCity) originFound = originCity.code;
    if (destCity) destFound = destCity.code;
  } else {
    const m2 = lowerText.match(directToPattern);
    if (m2) {
      const originCity = matchCity(m2[1]);
      const destCity = matchCity(m2[2]);
      if (originCity) originFound = originCity.code;
      if (destCity) destFound = destCity.code;
    }
  }

  // If from/to pattern failed, look for individual city mentions
  if (!originFound || !destFound) {
    const foundCodes = [];
    // Tokenize text into words
    const words = lowerText.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const singleWordCity = matchCity(words[i]);
      if (singleWordCity) {
        if (!foundCodes.includes(singleWordCity.code)) {
          foundCodes.push(singleWordCity.code);
        }
      }
      // Check two-word cities like "New York"
      if (i < words.length - 1) {
        const doubleWordCity = matchCity(words[i] + ' ' + words[i+1]);
        if (doubleWordCity) {
          if (!foundCodes.includes(doubleWordCity.code)) {
            foundCodes.push(doubleWordCity.code);
          }
        }
      }
    }

    if (foundCodes.length === 2) {
      // If we found two cities and didn't match the to/from pattern, let's assume first is origin, second is destination
      if (!originFound) originFound = foundCodes[0];
      if (!destFound) destFound = foundCodes[1];
    } else if (foundCodes.length === 1) {
      // If only one city is found, and we don't have either origin or destination set:
      // If "to [city]" is present, it's destination. If "from [city]" is present, it's origin.
      const singleCode = foundCodes[0];
      const cityObj = CITIES.find(c => c.code === singleCode);
      let isDest = false;
      let isOrig = false;

      for (const syn of cityObj.synonyms) {
        if (new RegExp(`\\bto\\s+${syn}\\b`).test(lowerText)) isDest = true;
        if (new RegExp(`\\b(?:from|out of|departing|leaving)\\s+${syn}\\b`).test(lowerText)) isOrig = true;
      }

      if (isDest) {
        destFound = singleCode;
      } else if (isOrig) {
        originFound = singleCode;
      } else {
        // No from/to indicator. Assign to whichever is missing.
        if (!slots.origin) {
          originFound = singleCode;
        } else if (!slots.destination && slots.origin !== singleCode) {
          destFound = singleCode;
        }
      }
    }
  }

  if (originFound) slots.origin = originFound;
  if (destFound) slots.destination = destFound;

  // --- 2. Extract Passenger Count ---
  // Look for patterns like "3 adults", "1 passenger", "two people", "just me"
  const passPattern = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:passenger|adult|child|people|person|seat|traveler)s?\b/;
  const pm = lowerText.match(passPattern);
  if (pm) {
    const parsedVal = parseInt(pm[1]);
    if (!isNaN(parsedVal)) {
      slots.passengerCount = parsedVal;
    } else {
      const wordVal = parseNumberWord(pm[1]);
      if (wordVal) slots.passengerCount = wordVal;
    }
  } else {
    // Check for "just me", "alone", "solo"
    if (/\b(just me|alone|myself|solo)\b/.test(lowerText)) {
      slots.passengerCount = 1;
    }
  }

  // --- 3. Extract Cabin Class ---
  for (const cc of CABIN_CLASSES) {
    for (const syn of cc.synonyms) {
      const rx = new RegExp(`\\b${syn}\\b`);
      if (rx.test(lowerText)) {
        slots.cabinClass = cc.name;
        break;
      }
    }
  }

  // --- 4. Extract Date Information ---
  // Identify time expressions: "tomorrow", "next Friday", "coming Monday", "June 24th", etc.
  // We can look for keywords and run them through parseNaturalDate
  const dateKeywords = [
    'today', 'tomorrow', 'day after tomorrow', 'day after',
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat',
    'next monday', 'next tuesday', 'next wednesday', 'next thursday', 'next friday', 'next saturday', 'next sunday',
    'coming monday', 'coming tuesday', 'coming wednesday', 'coming thursday', 'coming friday', 'coming saturday', 'coming sunday',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
    'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];

  // Try to find full matches for absolute dates
  // Regex for Month Day formats
  const absoluteDateRx = /\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?|\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\b/g;
  const absMatches = lowerText.match(absoluteDateRx);
  
  // Regex for ISO formats
  const isoDateRx = /\b\d{4}[-/]\d{2}[-/]\d{2}\b/g;
  const isoMatches = lowerText.match(isoDateRx);

  let dateToParse = null;

  if (absMatches && absMatches.length > 0) {
    dateToParse = absMatches[0];
  } else if (isoMatches && isoMatches.length > 0) {
    dateToParse = isoMatches[0];
  } else {
    // Look for relative keywords
    // Sort keywords by length descending to match longer strings first (e.g. "next Friday" before "Friday")
    const sortedKeywords = [...dateKeywords].sort((a, b) => b.length - a.length);
    for (const kw of sortedKeywords) {
      const rx = new RegExp(`\\b${kw}\\b`);
      if (rx.test(lowerText)) {
        // Grab the whole phrase if it includes modifiers
        const phraseRx = new RegExp(`\\b(coming|next|this)?\\s*${kw}\\b`);
        const pm = lowerText.match(phraseRx);
        dateToParse = pm ? pm[0] : kw;
        break;
      }
    }
  }

  if (dateToParse) {
    const resolvedDate = parseNaturalDate(dateToParse);
    if (resolvedDate) {
      // If we don't have a departure date yet, assign it.
      // If we already have a departure date, check if they are specifying a return date.
      if (!slots.departureDate) {
        slots.departureDate = resolvedDate;
      } else if (resolvedDate !== slots.departureDate && !slots.returnDate) {
        // If the resolved date is after departureDate, make it return date
        if (new Date(resolvedDate) >= new Date(slots.departureDate)) {
          slots.returnDate = resolvedDate;
        } else {
          // If before, overwrite departure date
          slots.departureDate = resolvedDate;
        }
      }
    }
  }

  // --- 5. Extract Airline Name & Flight Number ---
  const airlinesList = ['FlyBie Airlines', 'Emirates', 'Singapore Airlines', 'British Airways'];
  for (const air of airlinesList) {
    const rx = new RegExp(`\\b${air.toLowerCase()}\\b`);
    if (rx.test(lowerText)) {
      slots.preferredAirline = air;
    }
  }

  // Flight numbers like FB-101, EK-507
  const fnMatch = lowerText.match(/\b([a-z]{2}-\d{3,4})\b/);
  if (fnMatch) {
    slots.flightNumber = fnMatch[1].toUpperCase();
  }

  // Seat preference
  if (/\b(window|aisle|middle)\s+seat\b/.test(lowerText)) {
    const seatMatch = lowerText.match(/\b(window|aisle|middle)\s+seat\b/);
    slots.seatPreference = seatMatch[1].charAt(0).toUpperCase() + seatMatch[1].slice(1);
  }

  return slots;
}

// PII Detection and Protection
export function detectAndRedactPII(text) {
  const detectedPII = [];
  let redactedText = text;

  // 1. Email Address
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails) {
    emails.forEach(email => {
      detectedPII.push({ type: 'Email Address', value: email });
      redactedText = redactedText.replace(email, '[REDACTED EMAIL]');
    });
  }

  // 2. Phone Number
  // Match standard 10 digit numbers, or standard international numbers
  const phoneRegex = /\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g;
  const phones = text.match(phoneRegex);
  if (phones) {
    phones.forEach(phone => {
      // Filter out standard flight numbers, years, and dates like 2026-06-11
      if (!phone.includes('-06-') && !phone.includes('-11-') && phone.length >= 7) {
        detectedPII.push({ type: 'Phone Number', value: phone });
        redactedText = redactedText.replace(phone, '[REDACTED PHONE]');
      }
    });
  }

  // 3. Payment Information (Credit Cards)
  // Match 16-digit card formats with or without dashes
  const cardRegex = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g;
  const cards = text.match(cardRegex);
  if (cards) {
    cards.forEach(card => {
      detectedPII.push({ type: 'Payment Card', value: card });
      redactedText = redactedText.replace(card, '[REDACTED PAYMENT METHOD]');
    });
  }

  // CVV code (3 or 4 digits near words card/cvv/cvc)
  const cvvRegex = /\b(?:cvv|cvc|security code|code)\s*(?::|is)?\s*(\d{3,4})\b/ig;
  let cvvMatch;
  while ((cvvMatch = cvvRegex.exec(text)) !== null) {
    detectedPII.push({ type: 'CVV/Security Code', value: cvvMatch[1] });
    redactedText = redactedText.replace(cvvMatch[1], '[REDACTED CVV]');
  }

  // 4. Passport Number
  // Usually starts with a letter followed by 7 or 8 digits
  const passportRegex = /\b[A-Z][0-9]{7,8}\b/ig;
  const passports = text.match(passportRegex);
  if (passports) {
    passports.forEach(passport => {
      detectedPII.push({ type: 'Passport Number', value: passport });
      redactedText = redactedText.replace(passport, '[REDACTED PASSPORT]');
    });
  }

  // 5. Loyalty/Frequent Flyer Number
  // Matches FlyBie loyalty formats like FB-123456 or general ones
  const loyaltyRegex = /\b(?:FB|EK|SQ|BA|LH)-\d{6,8}\b/ig;
  const loyalties = text.match(loyaltyRegex);
  if (loyalties) {
    loyalties.forEach(loyalty => {
      detectedPII.push({ type: 'Loyalty Number', value: loyalty });
      redactedText = redactedText.replace(loyalty, '[REDACTED LOYALTY NUMBER]');
    });
  }

  // 6. Full Name Extraction (Heuristics)
  // If the user writes "my name is John Doe" or "passenger name: Jane Doe"
  const nameHeuristicRegex = /\b(?:my name is|passenger name is|traveler name is|passenger:)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)\b/ig;
  let nameMatch;
  while ((nameMatch = nameHeuristicRegex.exec(text)) !== null) {
    const fullName = nameMatch[1];
    detectedPII.push({ type: 'Full Name', value: fullName });
    redactedText = redactedText.replace(fullName, '[REDACTED NAME]');
  }

  return { redactedText, detectedPII };
}

// Search flights in mock database
export function searchFlights({ origin, destination, departureDate, passengerCount }) {
  if (!origin || !destination || !departureDate) return [];
  
  // Determine day of week index (0-6)
  const d = new Date(departureDate + 'T00:00:00');
  const dayOfWeek = d.getDay();

  // Filter flights matching origin, dest, and running on that day of week
  return mockFlights.filter(f => {
    const matchesOrigin = f.origin === origin;
    const matchesDest = f.destination === destination;
    const matchesDay = f.days.includes(dayOfWeek);
    return matchesOrigin && matchesDest && matchesDay;
  });
}
