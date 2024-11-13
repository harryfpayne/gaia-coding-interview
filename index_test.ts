import { expect, test } from "bun:test";
import {getAvailabilityData, type Timeslot} from "./index.ts";

test("multiple clinics", () => {
    const data: Timeslot[] = [
        {
            "clinicId": "1",
            "clinicName": "Aurora Reproductive Healthcare",
            "startTime": "2024-03-29T09:30:00Z",
            "endTime": "2024-03-29T10:00:00Z",
            "booked": false
        },
        {
            "clinicId": "2",
            "clinicName": "Somewhere else",
            "startTime": "2024-03-29T10:00:00Z",
            "endTime": "2024-03-29T12:00:00Z",
            "booked": false
        },
        {
            "clinicId": "1",
            "clinicName": "Aurora Reproductive Healthcare",
            "startTime": "2024-03-29T10:30:00Z",
            "endTime": "2024-03-29T11:00:00Z",
            "booked": true
        },
        {
            "clinicId": "2",
            "clinicName": "Somewhere else",
            "startTime": "2024-03-29T12:00:00Z",
            "endTime": "2024-03-29T13:00:00Z",
            "booked": true
        },
    ];

    const availability = getAvailabilityData(data);

    expect(availability["1"].totalSlotTimeMinutes).toBe(60);
    expect(availability["1"].totalBookedTimeMinutes).toBe(30);
    expect(availability["1"].availabilityRatio).toBe(0.5);

    expect(availability["2"].availabilityRatio).toBe(1/3);
});

test("fully booked", () => {
    const data: Timeslot[] = [
        {
            "clinicId": "1",
            "clinicName": "Aurora Reproductive Healthcare",
            "startTime": "2024-03-29T09:30:00Z",
            "endTime": "2024-03-29T10:00:00Z",
            "booked": true
        },
        {
            "clinicId": "1",
            "clinicName": "Aurora Reproductive Healthcare",
            "startTime": "2024-03-29T10:30:00Z",
            "endTime": "2024-03-29T11:00:00Z",
            "booked": true
        },
    ];

    const availability = getAvailabilityData(data);

    expect(availability["1"].availabilityRatio).toBe(1);
});