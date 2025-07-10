// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const usersCollection = db.collection('usersss'); // ¡Asegúrate que el nombre de la colección sea 'usersss'!

    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Devuelve el usuario creado (sin contraseña)
    const user = {
      _id: result.insertedId,
      username,
      email,
      createdAt: new Date(),
    };

    return NextResponse.json({ message: 'User registered successfully', user }, { status: 201 });

  } catch (error: any) {
    console.error('Error during signup:', error.message);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}