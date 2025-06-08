import { RoomData } from "./room.interface"

export type AddRoomData = Pick<RoomData, "room_number" | "room_type" | "capacity" | "price_per_night" | "hotel_id" | "description">