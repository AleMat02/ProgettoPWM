export enum RoomType {
    Single = "single", //Capienza di 1 persona
    Double = "double", //Capienza di 2 persone
    Family = "family" //Capienza di 4 persone
}

export const ROOM_CAPACITIES: { [key in RoomType]: number } = {
    [RoomType.Single]: 1,
    [RoomType.Double]: 2,
    [RoomType.Family]: 4,
};

export interface RoomData {
    id: number,
    room_number: number,
    room_type: RoomType,
    capacity: number, //dipende da room_type
    price_per_night: number,
    is_available: number,
    hotel_id: number, //vanno prima creati
    hotel_name: string,
    hotel_address: string,
    hotel_city: string,
    created_at: string,
    description?: string
}