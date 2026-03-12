export const ROUTES_DATA = {
    'calicut-university': [
        { name: 'Calicut University Bus Stop', lat: 11.1313974, lng: 75.8944613 },
        { name: 'Kohinoor', lat: 11.127121, lng: 75.895212 },
        { name: 'Devadiyal', lat: 11.124573, lng: 75.906802 },
        { name: 'Puthur Pallikal', lat: 11.126473, lng: 75.920423 },
        { lat: 11.1310704, lng: 75.9326348 },
        { lat: 11.1326508, lng: 75.9342445 },
        { name: 'Kummniparambu', lat: 11.135267, lng: 75.939838 },
        { name: 'EMEA College (Kummiparamba)', lat: 11.1341271, lng: 75.9428777 }
    ],
    'kondotty': [
        { name: 'Kondotty', lat: 11.1460, lng: 75.9633 },
        { name: 'Kolathur', lat: 11.157076, lng: 75.950126 },
        { name: 'Airport Junction', lat: 11.145249, lng: 75.948386 },
        { name: 'EMEA College (Kummiparamba)', lat: 11.1341, lng: 75.9429 }
    ]
};

export const getRouteByPath = (routeName) => {
    const normalized = (routeName || '').toLowerCase();
    if (normalized.includes('calicut') || normalized.includes('univers')) return ROUTES_DATA['calicut-university'];
    if (normalized.includes('kondotty')) return ROUTES_DATA['kondotty'];
    return [];
};
