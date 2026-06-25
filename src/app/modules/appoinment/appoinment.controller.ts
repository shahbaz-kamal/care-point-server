import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

import sendResponse from "../../shared/sendResponse";

import { AppointmentService } from "./appoinment.service";
import { IJwtPayload } from "../../types/common";


const createAppointment = catchAsync(async (req: Request , res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Appointment created successfully!",
        data: result
    })
});

export const AppointmentController = {
    createAppointment,
}