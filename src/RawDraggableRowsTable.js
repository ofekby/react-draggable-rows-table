import React, {Component} from 'react';
import ReactTable from 'react-table';
import './DraggableRowsTable.css'

class RawDraggableRowsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: {}
        };

        this.expanderColumn = {
            Header: '',
            Expander: ({isExpanded, original}) => original.children ?
                isExpanded ? props.expandedComponent || <span>-</span> : props.foldedComponent || <span>+</span>
                : null,
            expander: true
        };

        this.getTdProps = this.getTdProps.bind(this);
        this.getTrProps = this.getTrProps.bind(this);
    }

    getTrProps(state, {original}) {
        const {getDraggingProps, startedDraggingListener, endedDraggingListener, droppedOnListener, draggedOverListener, draggedOutOfTargetListener} = this.props;
        const {isDraggingTarget, isDraggable} = getDraggingProps(original);

        const trProps = {};

        if(isDraggable) {
            trProps.draggable = true;
            trProps.onDragStart = event => {
                event.dataTransfer.effectAllowed = 'move';

                const img = new Image();
                img.src = './src/style/pointer.png';
                event.dataTransfer.setDragImage(img, 0, 0);

                startedDraggingListener && startedDraggingListener(original);
            };
            trProps.onDragEnd = event => {
                const didDropped = event.dataTransfer.dropEffect !== 'none';

                endedDraggingListener && endedDraggingListener(didDropped);
            };
        }

        if(isDraggingTarget) {
            trProps.onDrop = (event) => {
                event.preventDefault();

                droppedOnListener && droppedOnListener(original);
            };
            trProps.onDragOver = (event) => {
              event.preventDefault();
            };
            trProps.onDragEnter = (event) => {
                event.preventDefault();

                draggedOverListener && draggedOverListener(original);
            };
            trProps.onDragLeave = (event) => {
                event.preventDefault();

                draggedOutOfTargetListener && draggedOutOfTargetListener(original);
            };
        }

        trProps.className = 'tableRow';

        if(original.isPlaceHolder) {
            trProps.className += ' placeHolderRow';
        }

        if(original.isPreviewRow) {
            trProps.className += ' previewRow';
        }

        return trProps;
    }

    getTdProps(state, row, column) {
        const tdProps = {};

        if(column.expander && row.original.children && !row.original.isPreviewRow) {
            tdProps.onDragOver = (event) => {
                event.preventDefault();

                this.setState({
                    expanded: {
                        ...this.state.expanded,
                        [row.index]: true
                    }
                })
            }
        }

        return tdProps;
    }

    render() {
        const {data, columns} = this.props;
        const {expanded} = this.state;

        if(data.length === 0) {
            return <h4>SHIT</h4>
        }

        return <ReactTable data={data}
                           columns={[this.expanderColumn, ...columns]}
                           className='ReactTable-highlight'
                           showPagination={false}
                           sortable={false}
                           resizable={false}
                           getTrProps={this.getTrProps}
                           getTdProps={this.getTdProps}
                           minRows
                           expanded={filterExpandedByIndex(data, expanded)}
                           onExpandedChange={expanded => this.setState({expanded})}
                           SubComponent={({original}) => original.children ?
                               <div className='innerTableClass'>
                                   <RawDraggableRowsTable {...this.props}
                                                          data={original.children}/>
                               </div> : null}/>
    }
}

const filterExpandedByIndex = (dataList, expanded) => {
    const newExpanded = {};

    Object.keys(expanded).filter(expandedIndex => !!expanded[expandedIndex] && !dataList[expandedIndex].isPreviewRow).forEach(index => {
       newExpanded[index] = true;
    });

    return newExpanded;
};

export default RawDraggableRowsTable;