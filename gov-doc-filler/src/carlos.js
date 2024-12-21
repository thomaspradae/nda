const sections = {
    personalInfo: [
      {
        groups: [
          // ... your existing groups and questions
          {
            // Group for the military service question
            questions: [
              {
                title: 'Have you served in the military?',
                layout: '100%',
                fieldType: 'radio',
                options: ['Yes', 'No'],
                name: 'militaryService',
                // No condition here, as this question is always displayed
              },
            ],
          },
          {
            // Conditional group for military service details
            condition: {
              field: 'militaryService',
              value: 'Yes',
            },
            questions: [
              {
                title: 'Branch of Service',
                layout: '50%',
                fieldType: 'text',
                name: 'branchOfService',
              },
              {
                title: 'Rank at Discharge',
                layout: '50%',
                fieldType: 'text',
                name: 'rankAtDischarge',
              },
              {
                title: 'Service Start Date',
                layout: '50%',
                fieldType: 'date',
                name: 'serviceStartDate',
              },
              {
                title: 'Service End Date',
                layout: '50%',
                fieldType: 'date',
                name: 'serviceEndDate',
              },
              // Add more military service-related questions as needed
            ],
          },
        ],
      },
      {
        title: 'Contact Information',
        groups: [
          // ... your existing contact information groups and questions
        ],
      },
    ],
    // ... other sections
  };
  