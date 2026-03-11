export const ROUTES_DATA = {
    'calicut-university': [
        { name: 'Calicut University', lat: 11.1314, lng: 75.8945 },
        { lat: 11.1290, lng: 75.8946 },
        { name: 'Kohinoor', lat: 11.1276, lng: 75.8947 },
        { lat: 11.1285, lng: 75.8975 },
        { lat: 11.1305, lng: 75.9010 },
        { name: 'Devathiyal', lat: 11.1345, lng: 75.9030 },
        { lat: 11.1365, lng: 75.9080 },
        { lat: 11.1375, lng: 75.9120 },
        { name: 'Puthur Pallikal', lat: 11.1377, lng: 75.9166 },
        { lat: 11.1385, lng: 75.9205 },
        { lat: 11.1375, lng: 75.9245 },
        { name: 'Vayaloram', lat: 11.1355, lng: 75.9280 },
        { lat: 11.1340, lng: 75.9315 },
        { lat: 11.1325, lng: 75.9350 },
        { lat: 11.1320, lng: 75.9370 },
        { name: 'Chembolchira', lat: 11.1332, lng: 75.9385 },
        { lat: 11.1345, lng: 75.9395 },
        { lat: 11.1355, lng: 75.9410 },
        { lat: 11.1345, lng: 75.9420 },
        { name: 'EMEA College (Kummiparamba)', lat: 11.1341, lng: 75.9429 }
    ],
    'kondotty': [
        { name: 'Kondotty', lat: 11.1481, lng: 75.9592 },
        { lat: 11.1496, lng: 75.9584 },
        { lat: 11.1518, lng: 75.9565 },
        { lat: 11.1543, lng: 75.9535 },
        { lat: 11.1562, lng: 75.9515 },
        { name: 'Kolathur', lat: 11.157483, lng: 75.949693 },
        { lat: 11.1545, lng: 75.9496 },
        { lat: 11.1515, lng: 75.9489 },
        { lat: 11.1485, lng: 75.9484 },
        { name: 'Airport Junction', lat: 11.145481, lng: 75.948158 },
        { lat: 11.1453, lng: 75.9460 },
        { lat: 11.1444, lng: 75.9425 },
        { lat: 11.1434, lng: 75.9395 },
        { lat: 11.1425, lng: 75.9370 },
        { name: 'EMEA College (Kummiparamba)', lat: 11.1341, lng: 75.9429 }
    ]
};

export const getRouteByPath = (routeName) => {
    const normalized = (routeName || '').toLowerCase();
    if (normalized.includes('calicut') || normalized.includes('univers')) return ROUTES_DATA['calicut-university'];
    if (normalized.includes('kondotty')) return ROUTES_DATA['kondotty'];
    return [];
};
