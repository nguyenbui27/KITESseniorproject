const NOMINATIM_USER_AGENT = 'KITESFamilySafety/1.0 (support@kites.local)';

const isValidCoordinate = (value: number, min: number, max: number) => Number.isFinite(value) && value >= min && value <= max;

export const reverseGeocodeAddress = async (latitude: number, longitude: number) => {
    if (!isValidCoordinate(latitude, -90, 90) || !isValidCoordinate(longitude, -180, 180)) {
        return null;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(String(latitude))}&lon=${encodeURIComponent(String(longitude))}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': NOMINATIM_USER_AGENT,
                },
                signal: controller.signal,
            },
        );
        clearTimeout(timeoutId);
        if (!response.ok) {
            return null;
        }
        const payload = await response.json();
        const displayName = typeof payload?.display_name === 'string' ? payload.display_name.trim() : '';
        return displayName || null;
    } catch {
        return null;
    }
};
