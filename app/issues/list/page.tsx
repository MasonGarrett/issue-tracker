import Pagination from '@/app/components/Pagination';
import prisma from '@/prisma/client';
import { Status } from '@prisma/client';
import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';
import IssueActions from './IssueActions';
import IssueTable, { IssueQuery, columnNames } from './IssueTable';

interface Props {
    searchParams: IssueQuery;
}

const IssuesPage = async ({ searchParams }: Props) => {
    // Status filter options
    const statuses = Object.values(Status);
    const status = statuses.includes(searchParams.status)
        ? searchParams.status
        : undefined;

    // Where clause definition
    const where = { status };

    // Column sort options
    const orderBy = columnNames.includes(searchParams.orderBy)
        ? { [searchParams.orderBy]: 'asc' }
        : undefined;

    // Get page value
    const page = parseInt(searchParams.page) || 1;
    const pageSize = 10;

    // Query issues with applied filters
    const issues = await prisma.issue.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
    const issueCount = await prisma.issue.count({ where });

    return (
        <Flex direction="column" gap="3">
            <IssueActions />
            <IssueTable searchParams={searchParams} issues={issues} />
            <Pagination
                pageSize={pageSize}
                currentPage={page}
                itemCount={issueCount}
            />
        </Flex>
    );
};

export const metadata: Metadata = {
    title: 'Issue Tracker - Issue List',
    description: 'View all project issues.',
};

export default IssuesPage;
