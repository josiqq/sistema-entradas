import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);
    const event = await prisma.event.findUnique({
      where: { event_id: eventId },
    });

    if (!event) {
      return NextResponse.json({ message: 'Evento no encontrado' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);
    const body = await request.json();

    const updatedEvent = await prisma.event.update({
      where: { event_id: eventId },
      data: {
        name: body.name,
        description: body.description,
        date: new Date(body.date),
        time: new Date(`1970-01-01T${body.time}:00Z`),
        location: body.location,
        capacity: parseInt(body.capacity),
        price: parseFloat(body.price),
        status: body.status,
        category: body.category,
        organizer: body.organizer,
        logo_url: body.logo_url,
      },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);
    await prisma.event.delete({
      where: { event_id: eventId },
    });
    return NextResponse.json({ message: 'Evento eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}