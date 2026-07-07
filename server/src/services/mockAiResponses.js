// Deterministic, structured mock responses used when GEMINI_API_KEY is not configured
// or when the Gemini API call fails for any reason. Keyword-matched against the citizen's
// message so the demo still feels responsive and on-topic without a live AI call.

const MOCK_KNOWLEDGE_BASE = [
  {
    keywords: ['ration card', 'ration'],
    response: {
      shortAnswer:
        'You can apply for a new ration card through your state’s Public Distribution System (PDS) portal or your local ration office.',
      steps: [
        'Visit your state PDS/food & civil supplies department portal or nearest ration office.',
        'Fill the ration card application form (new or modification).',
        'Attach the required documents and submit.',
        'Track application status online using your reference number.',
        'Collect the ration card once approved, or download the e-ration card if available.',
      ],
      requiredDocuments: ['Aadhaar card', 'Address proof', 'Income certificate', 'Family photograph'],
      eligibility: 'Indian residents; card category (APL/BPL/AAY) is decided by your state based on household income.',
      estimatedTime: '30-60 days',
      officialPortal: { label: 'National Food Security Act Portal', url: 'https://nfsa.gov.in' },
      warnings: [
        'Exact forms and fees vary by state — check your state food department site for the local process.',
        'Always verify current document requirements on the official portal before submitting.',
      ],
      relatedServices: ['Aadhaar Address/Details Update', 'Income Certificate'],
    },
  },
  {
    keywords: ['driving licence', 'driving license', 'dl ', 'learner licence', 'learner license'],
    response: {
      shortAnswer:
        'A driving licence application starts with a learner’s licence, followed by a driving test to get your permanent licence.',
      steps: [
        'Register on the Parivahan Sarathi portal and fill the learner licence form.',
        'Book a slot for the learner licence test (usually an online test).',
        'After passing, practice driving for at least 30 days.',
        'Book a permanent licence driving test slot on the same portal.',
        'Pass the test and receive your permanent driving licence.',
      ],
      requiredDocuments: ['Age proof', 'Address proof', 'Passport-size photographs', 'Medical certificate (for transport vehicles)'],
      eligibility: 'Minimum age 18 for most vehicle categories (16 with guardian consent for gearless two-wheelers).',
      estimatedTime: '30-45 days from learner to permanent licence',
      officialPortal: { label: 'Parivahan Sewa', url: 'https://parivahan.gov.in' },
      warnings: ['Test slot availability and fees vary by RTO — confirm on the Parivahan portal for your state.'],
      relatedServices: ['Voter ID (EPIC) Registration/Correction', 'Aadhaar Address/Details Update'],
    },
  },
  {
    keywords: ['scheme', 'student', 'scholarship'],
    response: {
      shortAnswer:
        'Students can access several central and state scholarships through the National Scholarship Portal based on merit and/or family income.',
      steps: [
        'Register on the National Scholarship Portal (NSP) with your institution details.',
        'Fill in academic and income details in the application form.',
        'Upload required documents (marksheets, income certificate, bank details).',
        'Submit the application before the state/scheme deadline.',
        'Track verification status at the institute and district level online.',
      ],
      requiredDocuments: ['Aadhaar card', 'Bank account details', 'Previous marksheet', 'Income certificate', 'Bonafide student certificate'],
      eligibility: 'Students enrolled in a recognized institution meeting the scheme’s income/academic criteria.',
      estimatedTime: '45-90 days, subject to institute and district verification',
      officialPortal: { label: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
      warnings: ['Deadlines differ by scheme and state — do not wait until the last date to apply.'],
      relatedServices: ['Income Certificate', 'PAN Card Application/Correction'],
    },
  },
  {
    keywords: ['streetlight', 'street light', 'broken light'],
    response: {
      shortAnswer:
        'A broken or non-functional streetlight can be reported directly through Smart Bharat’s civic issue reporting tool.',
      steps: [
        'Go to the "Report Civic Issue" page in this app.',
        'Select "Streetlight Issue" as the category.',
        'Add the exact location, a nearby landmark, and an optional photo.',
        'Submit — you will receive a complaint ID like SB-2026-1042.',
        'Track the repair status anytime using your complaint ID.',
      ],
      requiredDocuments: [],
      eligibility: 'Any citizen can report a civic issue in this app; no special eligibility needed.',
      estimatedTime: 'Typically 5-10 days depending on your municipal electricity department workload',
      officialPortal: { label: 'Smart Bharat Complaint Tracker', url: '/complaint-tracker' },
      warnings: ['For urgent public safety hazards (exposed wiring, etc.), also contact your local municipal helpline directly.'],
      relatedServices: ['Report Civic Issue', 'Complaint Tracker'],
    },
  },
  {
    keywords: ['aadhaar', 'aadhar', 'address update'],
    response: {
      shortAnswer:
        'You can update your Aadhaar address and other details online via the UIDAI portal or at a nearby Aadhaar Seva Kendra.',
      steps: [
        'Visit the UIDAI Self Service Update Portal (SSUP) or find a nearby Aadhaar Seva Kendra.',
        'Choose the detail you want to update (address, mobile, DOB, etc.).',
        'Upload a valid proof of address (for address updates) or relevant supporting document.',
        'Submit the request and note your Update Request Number (URN).',
        'Track status online using the URN; updated e-Aadhaar can be downloaded once approved.',
      ],
      requiredDocuments: ['Aadhaar number', 'Proof of address (recent utility bill/bank passbook)'],
      eligibility: 'All existing Aadhaar holders.',
      estimatedTime: '7-15 working days',
      officialPortal: { label: 'UIDAI', url: 'https://uidai.gov.in' },
      warnings: ['Never share your Aadhaar OTP with anyone claiming to "help" you update details.'],
      relatedServices: ['PAN Card Application/Correction', 'Voter ID (EPIC) Registration/Correction'],
    },
  },
];

const DEFAULT_MOCK_RESPONSE = {
  shortAnswer:
    'I can help with general guidance on this, but I don’t have enough certified detail to give you a fully specific answer right now. Could you tell me a bit more — for example, which state you’re in and exactly which service or document you need help with?',
  steps: [
    'Identify the exact government service or document you need.',
    'Search for it on your state government portal or the National Government Services Portal.',
    'Check the eligibility and document checklist listed there.',
    'Apply online where available, or visit the concerned local office.',
  ],
  requiredDocuments: ['Aadhaar card (commonly required for most services)'],
  eligibility: 'Depends on the specific service — please share more details so I can narrow this down.',
  estimatedTime: 'Varies by service',
  officialPortal: { label: 'National Government Services Portal', url: 'https://www.india.gov.in' },
  warnings: ['This is general guidance only — always confirm exact steps and documents on the official portal.'],
  relatedServices: [],
};

export const getMockAiResponse = (message) => {
  const normalized = (message || '').toLowerCase();
  const match = MOCK_KNOWLEDGE_BASE.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword))
  );
  return match ? match.response : DEFAULT_MOCK_RESPONSE;
};
