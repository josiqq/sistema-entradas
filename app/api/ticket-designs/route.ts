import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id, userId, ...data } = body;

    const newDesign = await prisma.ticketDesign.create({
      data: {
        name: data.name,
        templateId: data.templateId,
        eventName: data.eventName,
        date: data.date,
        time: data.time,
        location: data.location,
        ticketNumber: data.ticketNumber,
        ticketType: data.ticketType,
        price: data.price,
        qrCode: data.qrCode,
        category: data.category,
        organizer: data.organizer,
        logo: data.logo,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        fontFamily: data.fontFamily,
        fontSize: data.fontSize,
        borderRadius: data.borderRadius,
        orientation: data.orientation,
        format: data.format,
        userId: data.userId,
      },
    });

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error('Error al crear el diseño del ticket:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const designs = await prisma.ticketDesign.findMany();
    return NextResponse.json(designs);
  } catch (error) {
    console.error('Error fetching ticket designs:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}