// This file overrides the generated Next.js types to fix type errors
import { ReactNode } from 'react';

// Augment the Next.js module
declare module 'next' {
  export interface PageProps {
    params: any;
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}

// Add global type for page component props
declare global {
  type AppRouteProps<P = {[key: string]: string}> = {
    params: P;
    searchParams?: { [key: string]: string | string[] | undefined };
  };
}

export {};
