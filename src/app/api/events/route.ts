"use server";

import { NextResponse } from 'next/server';
import { getAllEvents, createEvent, deleteEvent } from '@/app/(dashboard)/events/events';

export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json({ events });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des exportations.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.start || !data.end || !data.start_time || !data.end_time) {
      throw new Error("Toutes les dates sont obligatoires");
    }
    
    try {
      const start = new Date(data.start);
      const end = new Date(data.end);
      const start_time = new Date(data.start_time);
      const end_time = new Date(data.end_time);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || 
          isNaN(start_time.getTime()) || isNaN(end_time.getTime())) {
        throw new Error("Une ou plusieurs dates sont invalides");
      }

      const event = await createEvent(
        data.title, 
        data.description, 
        data.location, 
        start, 
        end, 
        start_time, 
        end_time
      );
      
      return NextResponse.json({ event });
    } catch (dateError) {
      //console.error("Erreur de conversion de date:", dateError);
      throw new Error(`Erreur de format de date: ${dateError instanceof Error ? dateError.message : 'Erreur inconnue'}`);
    }
  } catch (error) {
    //console.error('Erreur POST événement:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
	try {
		const { id } = await request.json();
		const event = await deleteEvent(id);
		return NextResponse.json({ event });
	} catch (error) {
		//console.error('Erreur DELETE événement:', error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'événement' },
			{ status: 500 }
		);
	}
}