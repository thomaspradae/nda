export const sections = {
    personalInfo: [
      {
        title: 'Personal Information',
        baseText: "Let's start by filling out some",
        boldText: 'Personal Information',
        groups: [
          {
            questions: [
              {
                title: 'Name',
                name: 'fullName',
                subtitle: '(First, Middle, Last, Suffix)',
                layout: '50%',
                help: 'Please provide your full legal name as it appears on your government ID.',
              },
              {
                title: 'Alternate Names',
                name: 'alternateNames',
                subtitle: '(First, Middle, Last, Suffix) - List any names by which you are known or any names under which credit was previously received',
                layout: '50%',
                help: 'Please provide any other names you have used or are known by.',
              },
            ],
          },
          {
            questions: [
              {
                title: 'Date of Birth',
                name: 'dob',
                subtitle: '(mm-dd-yyyy)',
                layout: '50%',
              },
              {
                title: 'Social Security Number',
                name: 'ssn',
                subtitle: '(or Individual Taxpayer Identification Number)',
                layout: '50%',
              },
            ],
          },
          {
            questions: [
              {
                title: 'Citizenship',
                name: 'citizenship',
                layout: '50%',
              },
              {
                title: 'Marital Status',
                layout: '50%',
                fieldType: 'radio',
                options: ['Married', 'Separated', 'Unmaried'],
                name:'maritalStatus'
              },
            ],
          },
        ],
      },
      {
        title: 'Contact Information',
        baseText: 'Provide your contact details below.',
        boldText: 'Ensure your email address is correct for future correspondence.',
        groups: [
          {
            questions: [
              {
                title: 'Email',
                name: 'email',
                layout: '100%',
              },
            ],
          },
        ],
      },
    ],
    incomeSection: [
      {
        title: 'Income Information',
        baseText: 'Enter your employment and income details.',
        boldText: 'Accurate information ensures better processing.',
        groups: [
          {
            questions: [
              {
                title: 'Employment Status',
                name: 'employmentStatus',
                layout: '50%',
                fieldType: 'radio',
                options: ['Employed', 'Unemployed', 'Self-Employed', 'Retired'],
              },
              {
                title: 'Occupation',
                name: 'occupation',
                layout: '50%',
              },
            ],
          },
        ],
      },
      {
        title: 'Income Details',
        baseText: 'Provide detailed income sources.',
        boldText: 'Ensure all income sources are accurately reported.',
        groups: [
          {
            questions: [
              {
                title: 'Annual Income',
                name: 'annualIncome',
                layout: '50%',
              },
              {
                title: 'Income Source',
                name: 'incomeSource',
                layout: '50%',
              },
            ],
          },
        ],
      },
    ],
    assetsSection: [
      {
        title: 'Assets Information',
        baseText: 'List all your assets below.',
        boldText: 'Include all valuable possessions and investments.',
        groups: [
          {
            questions: [
              {
                title: 'Carlos Status',
                name: 'carlosStatus',
                layout: '50%',
                fieldType: 'radio',
                options: ['Carlos', 'Not Carlos'],
              },
              {
                title: 'Carlos Occupation',
                name: 'carlosOccupation',
                layout: '50%',
              },
            ],
          },
        ],
      },
    ],
    liabilitiesSection: [
      {
        title: 'Liabilities Information',
        baseText: 'Provide details about your liabilities.',
        boldText: 'Accurate information is crucial for assessment.',
        groups: [
          {
            questions: [
              {
                title: 'Liabilities Status',
                name: 'liabilitiesStatus',
                layout: '50%',
                fieldType: 'radio',
                options: ['Liabilities', 'Not Liabilities'],
              },
              {
                title: 'Liabilities Occupation',
                name: 'liabilitiesOccupation',
                layout: '50%',
              },
            ],
          },
        ],
      },
    ],
    realEstateSection: [
      {
        title: 'Real Estate Information',
        baseText: 'Enter information about your real estate properties.',
        boldText: 'Include all owned properties.',
        groups: [
          {
            questions: [
              {
                title: 'Real Estate Status',
                name: 'realEstateStatus',
                layout: '50%',
                fieldType: 'radio',
                options: ['Real Estate', 'Not Real Estate'],
              },
              {
                title: 'Real Estate Occupation',
                name: 'realEstateOccupation',
                layout: '50%',
              },
            ],
          },
        ],
      },
    ],
    loanInfoSection: [
      {
        title: 'Loan Information',
        baseText: 'Provide details about your loans.',
        boldText: 'Accurate loan information is required.',
        groups: [
          {
            questions: [
              {
                title: 'Loan Status',
                name: 'loanStatus',
                layout: '50%',
                fieldType: 'radio',
                options: ['Loan', 'Not Loan'],
              },
              {
                title: 'Loan Occupation',
                name: 'loanOccupation',
                layout: '50%',
              },
            ],
          },
        ],
      },
    ],
    agreementSection: [
      {
        title: 'Agreement Information',
        baseText: 'Enter details about your agreements.',
        boldText: 'Ensure all agreements are accurately represented.',
        groups: [
          {
            questions: [
              {
                title: 'Agreement Status',
                name: 'agreementStatus',
                layout: '50%',
                fieldType: 'radio',
                options: ['Agreement', 'Not Agreement'],
              },
              {
                title: 'Agreement Occupation',
                name: 'agreementOccupation',
                layout: '50%',
              },
            ],
          },
        ],
      },
    ],
  };

export const sectionTitles = {
    personalInfo: 'Personal',
    incomeSection: 'Income',
    carlosSection: 'Carlos',
    liabilitiesSection: 'Liabilities',
    realEstateSection: 'Real Estate',
    loanInfoSection: 'Loan',
    agreementSection: 'Agreement',
    assetsSection: 'Assets',
    // ... other section titles
  };
