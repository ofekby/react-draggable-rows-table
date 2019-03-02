import React from 'react';
import {storiesOf} from '@storybook/react';
import 'react-table/react-table.css'
import DraggableRowsTable from '../src/DraggableRowsTable';

const columns = [
    {
        Header: 'תוכן',
        accessor: 'content'
    }, {
        Header: 'סוג',
        accessor: 'type'
    }
];

const simpleData = [
    {
        content: 'yyyyyyy',
        type: 'human',
        children: [
            {
                content: 'cool',
                type: 'some',
                children: [
                    {
                        content: '1',
                        type: '1'
                    }, {
                        content: '2',
                        type: '2'
                    }
                ]
            }, {
                content: 'yes',
                type: 'goooo'
            }
        ]
    }, {
        content: 'ofek',
        type: 'aaaaa'
    }, {
        content: 'goot',
        type: 'human',
        children: [
            {
                content: 'in',
                type: 'nest'
            }
        ]
    }, {
        content: 'no',
        type: 'yes'
    }
];

storiesOf('Button', module)
    .add('with text', () => (
        <DraggableRowsTable data={simpleData}
                            columns={columns}/>
    ));