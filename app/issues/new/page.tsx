// Used to dynamically load component
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import IssueFormSkeleton from './loading';
const IssueForm = dynamic(() => import('@/app/issues/_components/IssueForm'), {
    ssr: false,
    loading: () => <IssueFormSkeleton />,
});

const NewIssuePage = () => {
    return <IssueForm />;
};

export const metadata: Metadata = {
    title: 'Issue Tracker - New Issue',
    description: 'Create a new issue.',
};

export default NewIssuePage;
