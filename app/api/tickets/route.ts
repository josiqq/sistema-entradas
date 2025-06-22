import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        purchase_date: 'desc',
      },
      include: {
        event: true,
        ticketDesign: true,
      },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { eventId, type, quantity, price, holderName, holderEmail, ticketDesignId } = await request.json();

    if (!eventId || !type || !quantity || !price || !holderName || !holderEmail) {
      return NextResponse.json({ message: 'Faltan campos obligatorios para generar tickets' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
        where: { event_id: eventId },
    });

    if (!event) {
        return NextResponse.json({ message: 'Evento no encontrado' }, { status: 404 });
    }

    if (ticketDesignId) {
      const design = await prisma.ticketDesign.findUnique({
        where: { id: ticketDesignId },
      });
      if (!design) {
        return NextResponse.json({ message: 'ID de plantilla de diseño no válido' }, { status: 400 });
      }
    }


    const createdTickets = [];
    for (let i = 0; i < quantity; i++) {
        const ticketId = `TK${nanoid(7).toUpperCase()}`;
        const qrCode = `${event.name.substring(0,3).toUpperCase()}-${ticketId}`;

        const newTicket = await prisma.ticket.create({
            data: {
                ticket_id: ticketId,
                event_id: eventId,
                holder_name: holderName,
                holder_email: holderEmail,
                type: type,
                price: parseFloat(price),
                status: 'Válida',
                purchase_date: new Date(),
                qr_code: qrCode,
                is_scanned: false,
                ticketDesignId: ticketDesignId || null,
            },
        });
        createdTickets.push(newTicket);
    }

    return NextResponse.json(createdTickets, { status: 201 });
  } catch (error) {
    console.error('Error generating tickets:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: (error as Error).message }, { status: 500 });
  }
}