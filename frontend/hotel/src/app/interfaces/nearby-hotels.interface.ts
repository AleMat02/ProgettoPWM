export interface PositionData {
    lat?: number,
    lng?: number,
    radius?: number,
}

export interface HotelPositionData {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    distance: number; //Distanza in km
}