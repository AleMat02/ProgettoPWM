export enum RoomType {
    Single = "single", //Capienza di 1 persona
    Double = "double", //Capienza di 2 persone
    Family = "family" //Capienza di 4 persone
}

export interface AddRoomData {
    room_number: number,
    room_type: RoomType,
    capacity: number, //dipende da room_type
    price_per_night: number,
    hotel_id: number, //vanno prima creati
    description?: string
}