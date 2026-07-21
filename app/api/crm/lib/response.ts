import { NextResponse } from 'next/server';
import { CrmApiError } from './auth';

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = 'Authentication required.') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden.') {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = 'Not found.') {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = 'Internal server error.') {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function handleApiError(error: unknown) {
  if (error instanceof CrmApiError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return serverError();
}
