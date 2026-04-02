(function () {
    const USER_STORE_KEY = 'agrihealth_backend_users_v1';
    const LOCATION_CACHE_KEY = 'agrihealth_live_location_v1';
    const WEATHER_API_CONFIG_KEY = 'agrihealth_weather_api_config_v1';

    const DEFAULT_WEATHER_API_CONFIG = {
        provider: 'open-meteo',
        apiKey: '',
        units: 'metric',
        lang: 'en'
    };

    const CROP_CALENDAR_DATA = {
        wheat: {
            name: 'Wheat',
            season: 'Rabi',
            sowing: 'Oct - Dec',
            harvest: 'March - April',
            durationDays: 150,
            regions: {
                default: {
                    note: 'Standard wheat schedule for North Indian plains.',
                    adjustments: { sowing: 0, irrigation: 0, fertilizer: 0, pesticide: 0, harvest: 0 }
                },
                bihar: {
                    sowing: 'Nov - Dec',
                    harvest: 'March - April',
                    note: 'Bihar schedule is shifted slightly later for cooler planting windows.',
                    adjustments: { sowing: 3, irrigation: 2, fertilizer: 2, pesticide: 2, harvest: 4 }
                },
                punjab: {
                    sowing: 'Oct - Nov',
                    harvest: 'March - April',
                    note: 'Punjab schedule favors early sowing for better tillering.',
                    adjustments: { sowing: -3, irrigation: -2, fertilizer: -1, pesticide: -1, harvest: -2 }
                }
            },
            tasks: [
                { group: 'Sowing', label: 'Sowing window', day: 0, endDay: 2, icon: 'ph-seedling', note: 'Use certified seed and seed treatment.' },
                { group: 'Fertilizer', label: 'DAP at sowing', day: 0, icon: 'ph-flask', note: 'Apply basal dose at sowing.' },
                { group: 'Irrigation', label: 'First irrigation', day: 20, icon: 'ph-drop', note: 'Tillering stage.' },
                { group: 'Fertilizer', label: 'Urea top dressing', day: 25, icon: 'ph-plant', note: 'Top dress after 25 days.' },
                { group: 'Pesticide', label: 'Rust scouting & spray', day: 40, icon: 'ph-spray-bottle', note: 'Watch for rust and aphid pressure.' },
                { group: 'Harvest', label: 'Harvesting period', day: 140, endDay: 150, icon: 'ph-scissors', note: 'Harvest when grain moisture drops.' }
            ]
        },
        rice: {
            name: 'Rice',
            season: 'Kharif',
            sowing: 'Jun - Jul',
            harvest: 'Oct - Nov',
            durationDays: 135,
            regions: {
                default: {
                    note: 'Rice schedule aligned to monsoon onset.',
                    adjustments: { sowing: 0, irrigation: 0, fertilizer: 0, pesticide: 0, harvest: 0 }
                },
                bihar: {
                    sowing: 'Jun - Jul',
                    harvest: 'Oct - Nov',
                    note: 'Bihar paddy schedule keeps transplanting close to monsoon timing.',
                    adjustments: { sowing: 2, irrigation: 2, fertilizer: 1, pesticide: 2, harvest: 3 }
                },
                punjab: {
                    sowing: 'May - Jun',
                    harvest: 'Sep - Oct',
                    note: 'Punjab basmati fields often start earlier because of irrigation support.',
                    adjustments: { sowing: -4, irrigation: -2, fertilizer: -1, pesticide: -1, harvest: -5 }
                }
            },
            tasks: [
                { group: 'Sowing', label: 'Nursery / transplanting', day: 0, endDay: 7, icon: 'ph-seedling', note: 'Prepare seedlings or transplant carefully.' },
                { group: 'Irrigation', label: 'Standing water check', day: 7, icon: 'ph-drop', note: 'Maintain shallow water depth.' },
                { group: 'Fertilizer', label: 'Basal nitrogen', day: 10, icon: 'ph-flask', note: 'Split nitrogen application.' },
                { group: 'Irrigation', label: 'Mid-season irrigation', day: 25, icon: 'ph-drop', note: 'Keep field saturated during tillering.' },
                { group: 'Pesticide', label: 'Pest / blast monitoring', day: 35, icon: 'ph-spray-bottle', note: 'Scout for blast and stem borer.' },
                { group: 'Harvest', label: 'Harvesting period', day: 120, endDay: 135, icon: 'ph-scissors', note: 'Harvest once grains mature and field drains.' }
            ]
        },
        maize: {
            name: 'Maize',
            season: 'Kharif / Zaid',
            sowing: 'Feb - Jul',
            harvest: 'Jun - Oct',
            durationDays: 120,
            regions: {
                default: {
                    note: 'Maize adapts well across warm seasons.',
                    adjustments: { sowing: 0, irrigation: 0, fertilizer: 0, pesticide: 0, harvest: 0 }
                },
                bihar: {
                    sowing: 'Jun - Jul',
                    harvest: 'Sep - Oct',
                    note: 'Bihar maize is often aligned with monsoon moisture availability.',
                    adjustments: { sowing: 1, irrigation: 1, fertilizer: 1, pesticide: 1, harvest: 2 }
                },
                punjab: {
                    sowing: 'Jan - Mar',
                    harvest: 'May - Jul',
                    note: 'Punjab hybrid maize often performs well in the spring / summer window.',
                    adjustments: { sowing: -2, irrigation: -1, fertilizer: -1, pesticide: -1, harvest: -3 }
                }
            },
            tasks: [
                { group: 'Sowing', label: 'Direct sowing', day: 0, endDay: 3, icon: 'ph-seedling', note: 'Sow in warm, well-drained soil.' },
                { group: 'Fertilizer', label: 'Starter fertilizer', day: 0, icon: 'ph-flask', note: 'Apply nitrogen and phosphorus starter dose.' },
                { group: 'Irrigation', label: 'First irrigation', day: 12, icon: 'ph-drop', note: 'Critical during early vegetative stage.' },
                { group: 'Pesticide', label: 'Stem borer scouting', day: 28, icon: 'ph-spray-bottle', note: 'Scout whorl damage and use targeted spray.' },
                { group: 'Fertilizer', label: 'Top dressing', day: 30, icon: 'ph-plant', note: 'Top dress nitrogen at knee-high stage.' },
                { group: 'Harvest', label: 'Harvesting period', day: 105, endDay: 120, icon: 'ph-scissors', note: 'Harvest after cobs dry and kernels harden.' }
            ]
        },
        sugarcane: {
            name: 'Sugarcane',
            season: 'Year-round',
            sowing: 'Feb - Apr',
            harvest: 'Dec - Mar',
            durationDays: 365,
            regions: {
                default: {
                    note: 'Sugarcane needs a long cycle with frequent monitoring.',
                    adjustments: { sowing: 0, irrigation: 0, fertilizer: 0, pesticide: 0, harvest: 0 }
                },
                bihar: {
                    sowing: 'Feb - Mar',
                    harvest: 'Dec - Feb',
                    note: 'Bihar cane schedule can shift slightly earlier in irrigated belts.',
                    adjustments: { sowing: 2, irrigation: 1, fertilizer: 2, pesticide: 2, harvest: 5 }
                },
                punjab: {
                    sowing: 'Mar - Apr',
                    harvest: 'Dec - Mar',
                    note: 'Punjab cane fields often favor spring planting.',
                    adjustments: { sowing: -1, irrigation: -1, fertilizer: -1, pesticide: -1, harvest: -2 }
                }
            },
            tasks: [
                { group: 'Sowing', label: 'Setts planting', day: 0, endDay: 5, icon: 'ph-seedling', note: 'Plant healthy setts in furrows.' },
                { group: 'Irrigation', label: 'First irrigation', day: 7, icon: 'ph-drop', note: 'Keep soil moist after planting.' },
                { group: 'Fertilizer', label: 'Nitrogen top-up', day: 30, icon: 'ph-flask', note: 'Split nitrogen in multiple doses.' },
                { group: 'Pesticide', label: 'Borer monitoring', day: 45, icon: 'ph-spray-bottle', note: 'Look for early borer damage.' },
                { group: 'Irrigation', label: 'Main irrigation cycle', day: 60, icon: 'ph-drop', note: 'Repeat irrigation based on soil moisture.' },
                { group: 'Harvest', label: 'Harvesting period', day: 330, endDay: 365, icon: 'ph-scissors', note: 'Cut when stalks reach maturity.' }
            ]
        },
        pulses: {
            name: 'Pulses',
            season: 'Rabi / Kharif',
            sowing: 'Oct - Nov / Jun - Jul',
            harvest: 'Feb - Mar / Sep - Oct',
            durationDays: 110,
            regions: {
                default: {
                    note: 'Pulses improve soil health with moderate irrigation.',
                    adjustments: { sowing: 0, irrigation: 0, fertilizer: 0, pesticide: 0, harvest: 0 }
                },
                bihar: {
                    sowing: 'Oct - Nov / Jun - Jul',
                    harvest: 'Feb - Mar / Sep - Oct',
                    note: 'Bihar pulse fields benefit from timely weed control and drainage.',
                    adjustments: { sowing: 2, irrigation: 1, fertilizer: 1, pesticide: 1, harvest: 2 }
                },
                punjab: {
                    sowing: 'Oct - Nov',
                    harvest: 'Feb - Mar',
                    note: 'Punjab pulse acreage often follows irrigated rotation systems.',
                    adjustments: { sowing: -1, irrigation: -1, fertilizer: -1, pesticide: -1, harvest: -2 }
                }
            },
            tasks: [
                { group: 'Sowing', label: 'Direct sowing', day: 0, endDay: 2, icon: 'ph-seedling', note: 'Use treated seed for better germination.' },
                { group: 'Fertilizer', label: 'Starter nutrient dose', day: 0, icon: 'ph-flask', note: 'Apply balanced starter nutrients.' },
                { group: 'Irrigation', label: 'Pre-flowering irrigation', day: 25, icon: 'ph-drop', note: 'Avoid moisture stress during flowering.' },
                { group: 'Pesticide', label: 'Aphid / pod borer watch', day: 35, icon: 'ph-spray-bottle', note: 'Inspect pods and flowering nodes.' },
                { group: 'Fertilizer', label: 'Top dressing', day: 40, icon: 'ph-plant', note: 'Light top dressing after flowering.' },
                { group: 'Harvest', label: 'Harvesting period', day: 95, endDay: 110, icon: 'ph-scissors', note: 'Harvest once pods are dry and firm.' }
            ]
        }
    };

    const DEFAULT_GOVERNMENT_SCHEMES = [
        {
            title: 'PM-KISAN Samman Nidhi',
            desc: 'Income support of Rs. 6,000 per year for eligible farmer families.',
            time: 'Updated from official portal',
            icon: 'ph-currency-inr',
            color: '#059669',
            link: 'https://pmkisan.gov.in/',
            category: 'financial',
            important: true
        },
        {
            title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
            desc: 'Crop insurance support for losses due to natural calamities and pests.',
            time: 'Updated from official portal',
            icon: 'ph-shield-check',
            color: '#059669',
            link: 'https://pmfby.gov.in/',
            category: 'insurance',
            important: true
        },
        {
            title: 'Soil Health Card Scheme',
            desc: 'Soil testing guidance with nutrient recommendations for better productivity.',
            time: 'Updated from official portal',
            icon: 'ph-flask',
            color: '#059669',
            link: 'https://soilhealth.dac.gov.in/',
            category: 'soil',
            important: false
        },
        {
            title: 'Kisan Credit Card (KCC)',
            desc: 'Institutional credit support for crop production and allied activities.',
            time: 'Updated from official portal',
            icon: 'ph-credit-card',
            color: '#059669',
            link: 'https://www.myscheme.gov.in/schemes/kcc',
            category: 'credit',
            important: false
        }
    ];

    const WEATHER_ALERTS = [
        {
            title: 'Heavy rainfall advisory',
            desc: 'Drain field channels today to avoid standing water and root stress.',
            time: '2 hours ago',
            icon: 'ph-cloud-rain',
            color: '#3b82f6'
        },
        {
            title: 'Humidity rise forecast',
            desc: 'Monitor fungal hotspots and plan preventive spray in high-risk plots.',
            time: '5 hours ago',
            icon: 'ph-cloud-fog',
            color: '#3b82f6'
        }
    ];

    const EMERGENCY_ALERTS = [
        {
            title: 'Nearby pest movement advisory',
            desc: 'Scout leaves in the evening and report unusual damage immediately.',
            time: '6 hours ago',
            icon: 'ph-warning',
            color: '#ef4444'
        }
    ];

    function safeReadJSON(key, fallbackValue) {
        try {
            return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallbackValue));
        } catch {
            return fallbackValue;
        }
    }

    function saveUserDetails(profile) {
        if (!profile || !profile.email) return;
        const users = safeReadJSON(USER_STORE_KEY, {});
        users[profile.email.toLowerCase()] = {
            fullName: profile.fullName || 'Farmer',
            username: profile.username || 'farmer',
            email: profile.email.toLowerCase(),
            phone: profile.phone || '',
            address: profile.address || '',
            avatar: profile.avatar || ''
        };
        localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
    }

    function getUserDetails(email) {
        if (!email) return null;
        const users = safeReadJSON(USER_STORE_KEY, {});
        return users[email.toLowerCase()] || null;
    }

    function reverseGeocode(lat, lon) {
        const endpoint = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + encodeURIComponent(lat) + '&lon=' + encodeURIComponent(lon);
        return fetch(endpoint)
            .then(function (response) {
                if (!response.ok) throw new Error('Reverse geocoding failed');
                return response.json();
            })
            .then(function (data) {
                const address = data.address || {};
                const city = address.city || address.town || address.village || address.state_district || 'Local area';
                const state = address.state || '';
                const country = address.country || '';
                const label = [city, state, country].filter(Boolean).join(', ');
                return label || 'Live location detected';
            })
            .catch(function () {
                return 'Live location detected';
            });
    }

    function getLiveLocation() {
        return new Promise(function (resolve) {
            if (!navigator.geolocation) {
                const cached = safeReadJSON(LOCATION_CACHE_KEY, null);
                resolve(cached || {
                    lat: null,
                    lon: null,
                    label: 'Location service unavailable',
                    source: 'fallback',
                    updatedAt: new Date().toISOString()
                });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = Number(position.coords.latitude.toFixed(5));
                    const lon = Number(position.coords.longitude.toFixed(5));
                    reverseGeocode(lat, lon).then(function (label) {
                        const live = {
                            lat: lat,
                            lon: lon,
                            label: label,
                            source: 'geolocation',
                            updatedAt: new Date().toISOString()
                        };
                        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(live));
                        resolve(live);
                    });
                },
                function () {
                    const cached = safeReadJSON(LOCATION_CACHE_KEY, null);
                    resolve(cached || {
                        lat: null,
                        lon: null,
                        label: 'Location permission not granted',
                        source: 'fallback',
                        updatedAt: new Date().toISOString()
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 60000
                }
            );
        });
    }

    function fetchGovernmentSchemeUpdates() {
        const timestamp = new Date().toLocaleString();
        return fetch('/api/govt-schemes')
            .then(function (response) {
                if (!response.ok) throw new Error('Gov schemes endpoint unavailable');
                return response.json();
            })
            .then(function (schemes) {
                if (!Array.isArray(schemes) || !schemes.length) {
                    throw new Error('No schemes from API');
                }

                return schemes.map(function (scheme) {
                    return {
                        title: scheme.title || 'Government Scheme',
                        desc: scheme.description || scheme.desc || 'New scheme update available.',
                        time: timestamp,
                        icon: scheme.icon || 'ph-government',
                        color: scheme.color || '#059669',
                        link: scheme.link || '#',
                        category: scheme.category || 'general',
                        important: !!scheme.important
                    };
                });
            })
            .catch(function () {
                return DEFAULT_GOVERNMENT_SCHEMES.map(function (scheme) {
                    return {
                        title: scheme.title,
                        desc: scheme.desc,
                        time: timestamp,
                        icon: scheme.icon,
                        color: scheme.color,
                        link: scheme.link,
                        category: scheme.category,
                        important: scheme.important
                    };
                });
            });
    }

    function getWeatherApiConfig() {
        const config = safeReadJSON(WEATHER_API_CONFIG_KEY, DEFAULT_WEATHER_API_CONFIG);
        return {
            provider: config.provider || DEFAULT_WEATHER_API_CONFIG.provider,
            apiKey: config.apiKey || DEFAULT_WEATHER_API_CONFIG.apiKey,
            units: config.units || DEFAULT_WEATHER_API_CONFIG.units,
            lang: config.lang || DEFAULT_WEATHER_API_CONFIG.lang
        };
    }

    function setWeatherApiKey(apiKey) {
        const current = getWeatherApiConfig();
        const updated = {
            ...current,
            apiKey: (apiKey || '').trim()
        };
        localStorage.setItem(WEATHER_API_CONFIG_KEY, JSON.stringify(updated));
        return updated;
    }

    function getAlertSeedData() {
        return {
            weather: WEATHER_ALERTS.slice(),
            government: DEFAULT_GOVERNMENT_SCHEMES.slice(),
            emergency: EMERGENCY_ALERTS.slice()
        };
    }

    function getCropCalendarCatalog() {
        return JSON.parse(JSON.stringify(CROP_CALENDAR_DATA));
    }

    window.AgriBackend = {
        saveUserDetails: saveUserDetails,
        getUserDetails: getUserDetails,
        getLiveLocation: getLiveLocation,
        fetchGovernmentSchemeUpdates: fetchGovernmentSchemeUpdates,
        getAlertSeedData: getAlertSeedData,
        getCropCalendarCatalog: getCropCalendarCatalog,
        getWeatherApiConfig: getWeatherApiConfig,
        setWeatherApiKey: setWeatherApiKey
    };
})();
