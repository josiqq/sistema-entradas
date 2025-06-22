import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticketId = id;
    const ticket = await prisma.ticket.findUnique({
      where: { ticket_id: ticketId },
      include: {
        event: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket no encontrado' }, { status: 404 });
    }
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticketId = id;
    const body = await request.json();

    const updatedTicket = await prisma.ticket.update({
      where: { ticket_id: ticketId },
      data: {
        holder_name: body.holderName,
        holder_email: body.holderEmail,
        type: body.type,
        price: body.price,
        status: body.status,
        is_scanned: body.isScanned,
        scanned_time: body.scannedTime ? new Date(body.scannedTime) : null,
        gate_used: body.gateUsed,
      },
    });
    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticketId = id;
    await prisma.ticket.delete({
      where: { ticket_id: ticketId },
    });
    return NextResponse.json({ message: 'Ticket eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}