
export const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
    username: 'jc',
    password: 'abc123',
    name: 'Test User'
};

export const mockUserProfile = {
    id: '550e8400-e29b-41d4-a716-446655440001', // Valid UUID format
    user_id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
    name: 'Test User',
    goal: 'lose-weight',
    dietary_preference: 'balanced',
    time_commitment: '30min'
};

export const mockQuizQuestions = [
    {
        id: 'q1',
        title: 'What is your main fitness goal?',
        description: 'This helps us personalize your experience',
        type: 'radio',
        required: true,
        options: [
            { id: 'lose-weight', label: 'Lose weight' },
            { id: 'gain-weight', label: 'Gain weight' },
            { id: 'maintain-weight', label: 'Maintain weight' },
            { id: 'build-muscle', label: 'Build muscle' }
        ]
    },
    {
        id: 'q2',
        title: 'How much time can you dedicate to meal prep?',
        type: 'radio',
        required: false,
        options: [
            { id: '15min', label: '15 minutes or less' },
            { id: '30min', label: '30 minutes' },
            { id: '1hour', label: '1 hour or more' },
            { id: 'flexible', label: 'Flexible' }
        ]
    },
    {
        id: 'q3',
        title: 'What type of recipes do you prefer?',
        type: 'radio',
        required: false,
        options: [
            { id: 'quick', label: 'Quick and easy' },
            { id: 'healthy', label: 'Healthy and nutritious' },
            { id: 'variety', label: 'Variety of cuisines' }
        ]
    }
];

export const mockFeatureFlags = [
    { key: 'welcome-message', value: 'false' },
    { key: 'show-branding', value: 'false' }
];