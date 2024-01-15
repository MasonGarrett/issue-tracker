import { IssueStatusBadge, Link } from '@/app/components';
import prisma from '@/prisma/client';
import { Issue, Status } from '@prisma/client';
import { ArrowUpIcon } from '@radix-ui/react-icons';
import { Table } from '@radix-ui/themes';
import NextLink from 'next/link';
import IssueActions from './IssueActions';

interface Props {
    searchParams: { status: Status; orderBy: keyof Issue };
}

const IssuesPage = async ({ searchParams }: Props) => {
    // Column Headers
    const columns: { label: string; value: keyof Issue; className?: string }[] =
        [
            { label: 'Issue', value: 'title' },
            {
                label: 'Status',
                value: 'status',
                className: 'hidden md:table-cell',
            },
            {
                label: 'Created',
                value: 'createdAt',
                className: 'hidden md:table-cell',
            },
        ];

    // Status filter options
    const statuses = Object.values(Status);
    const status = statuses.includes(searchParams.status)
        ? searchParams.status
        : undefined;

    // Column sort options
    const orderBy = columns
        .map((column) => column.value)
        .includes(searchParams.orderBy)
        ? { [searchParams.orderBy]: 'asc' }
        : undefined;

    // Query issues with applied filters
    const issues = await prisma.issue.findMany({
        where: {
            status,
        },
        orderBy,
    });

    return (
        <div>
            <IssueActions />
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        {columns.map((column) => (
                            <Table.ColumnHeaderCell key={column.value}>
                                <NextLink
                                    href={{
                                        query: {
                                            ...searchParams,
                                            orderBy: column.value,
                                        },
                                    }}
                                >
                                    {column.label}
                                </NextLink>
                                {column.value === searchParams.orderBy && (
                                    <ArrowUpIcon className="inline" />
                                )}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {issues?.map((issue) => (
                        <Table.Row key={issue.id}>
                            <Table.Cell>
                                <Link href={`/issues/${issue.id}`}>
                                    {issue.title}
                                </Link>
                                <div className="block md:hidden">
                                    <IssueStatusBadge status={issue.status} />
                                </div>
                            </Table.Cell>
                            <Table.Cell className="hidden md:table-cell">
                                <IssueStatusBadge status={issue.status} />
                            </Table.Cell>
                            <Table.Cell className="hidden md:table-cell">
                                {issue.createdAt.toDateString()}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    );
};

export default IssuesPage;
