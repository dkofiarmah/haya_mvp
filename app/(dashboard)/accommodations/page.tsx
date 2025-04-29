import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Database } from '@/types/supabase';

// Tell Next.js this is a dynamic route that should not be statically generated
export const dynamic = 'force-dynamic';

const AccommodationsPage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Define types for organization data
  type UserOrg = {
    organization_id: string;
    name?: string;
    role?: string;
  }
  
  // Get user's organizations - using from() instead of rpc() to avoid type issues
  let orgs: UserOrg[] = [];
  try {
    const { data, error } = await supabase
      .from('user_organizations')
      .select('organization_id, organizations(name), role');
      
    if (error) {
      console.error('Error fetching user organizations:', error);
      return (
        <div className="container mx-auto py-6">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">Unable to load your organizations. Please try again later.</span>
          </div>
        </div>
      );
    }
    
    orgs = data?.map(item => ({
      organization_id: item.organization_id,
      name: item.organizations?.name,
      role: item.role
    })) || [];
  } catch (err) {
    console.error('Exception fetching user organizations:', err);
    return (
      <div className="container mx-auto py-6">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">An unexpected error occurred. Please try again later.</span>
        </div>
      </div>
    );
  }
  
  const orgIds = orgs.map(org => org.organization_id);
  
  // If no organizations found, show a message
  if (orgIds.length === 0) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Accommodations</h1>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded relative" role="alert">
          <p>You don't have any organizations yet. Please create or join an organization first.</p>
          <Link href="/organizations/new" className="mt-2 inline-block text-blue-600 underline">
            Create Organization
          </Link>
        </div>
      </div>
    );
  }
  
  // Fetch accommodations for user's organizations
  let accommodations = [];
  let error = null;
  
  try {
    const { data, error: accommodationsError } = await supabase
      .from('accommodations')
      .select('*')
      .in('organization_id', orgIds);
    
    if (accommodationsError) {
      error = accommodationsError;
      console.error('Error fetching accommodations:', accommodationsError);
    } else {
      accommodations = data || [];
    }
  } catch (err) {
    error = err;
    console.error('Exception fetching accommodations:', err);
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Accommodations</h1>
        <Link href="/accommodations/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Accommodation
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations && accommodations.length > 0 ? (
          accommodations.map((accommodation) => (
            <Link href={`/accommodations/${accommodation.id}`} key={accommodation.id}>
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {accommodation.image_url ? (
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={accommodation.image_url} 
                      alt={accommodation.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{accommodation.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{accommodation.location}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{accommodation.type || 'Hotel'}</span>
                    <span className="mx-2">•</span>
                    <span>${accommodation.price_per_night} / night</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-700">No accommodations found</h3>
            <p className="mt-2 text-gray-500">Add your first accommodation to get started</p>
            <Link href="/accommodations/new">
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Accommodation
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationsPage;
