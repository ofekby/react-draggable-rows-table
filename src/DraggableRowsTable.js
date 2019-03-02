import React, {Component} from 'react';
import {
    addRowNodeIdProp,
    convertToInDraggingState,
    replacePlaceHolderWithRowData,
    setDraggedRowBeforeDroppedOnRow
} from "./DraggableRowsTableUtil";
import RawDraggableRowsTable from './RawDraggableRowsTable';
import deepEquals from 'fast-deep-equal';

class DraggableRowsTable extends Component {
    constructor(props) {
        super(props);

        this.dataWithRowNodeId = addRowNodeIdProp(props.data);

        this.state = {
            displayedData: this.dataWithRowNodeId,
            draggedRowData: undefined
        };

        this.startedDraggingListener = this.startedDraggingListener.bind(this);
        this.endedDraggingListener = this.endedDraggingListener.bind(this);
        this.draggedOverListener = this.draggedOverListener.bind(this);
        this.draggedOutOfTargetListener = this.draggedOutOfTargetListener.bind(this);

        this.invokeOverEffectInterval = setInterval(() => {
            if(this.overEffectFunction) {
                this.overEffectFunction();

                this.overEffectFunction = undefined;
            }
        }, 100)
    }

    componentWillUnmount() {
        clearInterval(this.invokeOverEffectInterval);
    }

    componentDidUpdate(prevProps) {
        const {data} = this.props;

        if(!deepEquals(prevProps.data, data)) {
            this.dataWithRowNodeId = addRowNodeIdProp(data);

            this.setState({
                displayedData: this.dataWithRowNodeId
            });
        }
    }

    startedDraggingListener(draggedRowData) {
        this.setState({
            draggedRowData
        });

        this.initalDataInDraggingState = convertToInDraggingState(this.dataWithRowNodeId, draggedRowData.rowNodeId);

        setImmediate(() => this.setState({
                displayedData: this.initalDataInDraggingState
            }))
    }

    endedDraggingListener(didDropped) {
        this.setState({
            draggedRowData: undefined
        });

        if(!didDropped) {
            setImmediate(() => this.setState({
                displayedData: this.dataWithRowNodeId
            }))
        }
    }

    draggedOverListener(draggedOverTargetRowData) {
        const {draggedRowData} = this.state;

        const previewRowData = {
            ...draggedRowData,
            isPreviewRow: true
        };

        if(!draggedOverTargetRowData.isPreviewRow) {
            const dataToBeDesplayed = draggedOverTargetRowData.isPlaceHolder ?
                replacePlaceHolderWithRowData(this.initalDataInDraggingState, draggedOverTargetRowData.placeHolderId, previewRowData)
                : setDraggedRowBeforeDroppedOnRow(this.initalDataInDraggingState, previewRowData, draggedOverTargetRowData.rowNodeId)

            setImmediate(() => this.setState({
                displayedData: dataToBeDesplayed
            }));
         }
    }

    draggedOutOfTargetListener() {
        setImmediate(() => this.setState({
            displayedData: this.initalDataInDraggingState
        }))
    }


    render() {
        const {displayedData} = this.state;
        const {columns} = this.props;

        return <RawDraggableRowsTable data={displayedData}
                                      columns={columns}
                                      startedDraggingListener={this.startedDraggingListener}
                                      endedDraggingListener={this.endedDraggingListener}
                                      draggedOutOfTargetListener={this.draggedOutOfTargetListener}
                                      draggedOverListener={(draggedOverTargetRowData) => {
                                          this.overEffectFunction = () => this.draggedOverListener(draggedOverTargetRowData);
                                      }}
                                      getDraggingProps={() => ({
                                          isDraggingTarget: true,
                                          isDraggable: true
                                      })}/>
    }
}

export default DraggableRowsTable;