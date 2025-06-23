export interface SearchData {
    hotel_id?: number,
    from_date?: string,
    limit?: number
}

export interface BookingData {
    capacity : number,
    check_in : string,
    check_out : string,
    created_at : string,   
    description : string,
    guest_id : number,
    hotel_id : number,
    hotel_name : string,
    id : number,
    is_available : boolean,
    is_offer : boolean,
    price_per_night : number,
    processed_at : string | null,
    reception_id : number | null,
    room_id : number,
    room_number : string,
    room_type : string,
    status : string,
    total_price : number
}