import {uniqueId} from 'lodash/util'

export const convertToInDraggingState = (dataList, draggedRowId, doAddPlaceHolderAtTheEnd = true) => {
  const filledWithPlaceHoldersDataList = dataList.filter(rowData => rowData.rowNodeId !== draggedRowId).map(rowData => rowData.children ? {
      ...rowData,
      children: convertToInDraggingState(rowData.children, draggedRowId, !rowData.isFixedLengthChildrens)
  } : rowData);

  if(doAddPlaceHolderAtTheEnd) {
      filledWithPlaceHoldersDataList.splice(filledWithPlaceHoldersDataList.length, 0, {
          isPlaceHolder: true,
          placeHolderId: uniqueId('placeHolderId')
      });
  }

  return filledWithPlaceHoldersDataList;
};

export const addRowNodeIdProp = (dataList) =>
    dataList.map(rowData => rowData.children ? {
        ...rowData,
        rowNodeId: uniqueId('rowNodeId'),
        children: addRowNodeIdProp(rowData.children)
    } : {
        ...rowData,
        rowNodeId: uniqueId('rowNodeId')
    });

export const replacePlaceHolderWithRowData = (dataList, placeHolderId, draggedRowData) =>
    dataList.map(rowData => {
       if(rowData.placeHolderId === placeHolderId) {
           return draggedRowData;
       }

       if(rowData.children) {
           return {
               ...rowData,
               children: replacePlaceHolderWithRowData(rowData.children, placeHolderId, draggedRowData)
           }
       }

       return rowData;
    });

export const setDraggedRowBeforeDroppedOnRow = (dataList, draggedRowData, droppedOnRowNodeId) => {
    const updatedDataList = dataList.map(rowData => rowData.children ? {
        ...rowData,
        children: setDraggedRowBeforeDroppedOnRow(rowData.children, draggedRowData, droppedOnRowNodeId)
    } : rowData);

    const droppedOnRowIndex = updatedDataList.findIndex(({rowNodeId}) => rowNodeId === droppedOnRowNodeId);

    if(droppedOnRowIndex !== -1) {
        updatedDataList.splice(droppedOnRowIndex, 0, draggedRowData); // Insert the dragged row before the dropped on row
        updatedDataList.splice(-1, 1); // Remove the current array place holder
    }

    return updatedDataList;
};