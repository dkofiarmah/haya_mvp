import { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { getExperiences } from '@/app/actions/experiences';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import ExperiencesListView from '@/components/experiences/experiences-list-view';

export const metadata: Metadata = {
  title: 'Experiences | Haya',
  description: 'Manage your travel experiences',
};

export default async function ExperiencesPage() {
  const { experiences } = await getExperiences();
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Experiences' }
        ]} />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage travel experiences for your customers.
          </p>
        </div>
        <Link
          href="/experiences/new"
          className={buttonVariants({ size: 'default' }) + " mt-4 md:mt-0"}
        >
          Create Experience
        </Link>
      </div>
      
      <ExperiencesListView experiences={experiences} />
    </div>
  );
}
