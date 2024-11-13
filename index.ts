import data from "./data.json";

export interface Timeslot {
    clinicId: string;
    clinicName: string;
    startTime: string;
    endTime: string;
    booked: boolean;
}

interface AvailabilityData {
    clinicId: string;
    clinicName: string;
    totalSlotTimeMinutes: number;
    totalBookedTimeMinutes: number;
    availabilityRatio: number;
}

function generateAvailabilityDataForNewClinic(ts: Timeslot): AvailabilityData {
    return {
        clinicId: ts.clinicId,
        clinicName: ts.clinicName,
        totalSlotTimeMinutes: 0,
        totalBookedTimeMinutes: 0,
        get availabilityRatio(): number {
            return this.totalBookedTimeMinutes / this.totalSlotTimeMinutes
        }
    }
}

export function getSlotDurationMinutes(ts: Timeslot): number {
    return (new Date(ts.endTime).getTime() - new Date(ts.startTime).getTime()) / (1000 * 60);
}

export function getAvailabilityData(timeslots: Timeslot[]): Record<string, AvailabilityData> {
    const availability: Record<string, AvailabilityData> = {}

    for (const ts of timeslots) {
        if (!availability.hasOwnProperty(ts.clinicId)) {
            availability[ts.clinicId] = generateAvailabilityDataForNewClinic(ts);
        }

        const slotDuration = getSlotDurationMinutes(ts);
        availability[ts.clinicId].totalSlotTimeMinutes += slotDuration;
        if (ts.booked) {
            availability[ts.clinicId].totalBookedTimeMinutes += slotDuration;
        }
    }

    return availability;
}

const timeslots: Timeslot[] = data;
const availability = getAvailabilityData(timeslots);

Object.entries(availability).forEach(([clinicId, clinic]) => {
    console.log(`${clinic.clinicName}: ${clinic.availabilityRatio * 100}%`)
})






