import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { DragDropContext } from '@hello-pangea/dnd';
import initialData from './init-data';
import Column from './column';

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = initialData;
 
  
  onDragEnd = result => {
    const { destination, source, draggableId } = result;
    
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);
  };

  handleSubmit = (e) => {
    const data = e.target.value;
    const newTask = {
      id: Math.random(),
      content: data,
    };

    const newState = {
      ...this.state,
      tasks: {
        ...this.state.tasks,
        newTask,
      },
    };
    
    this.setState(newState);
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(
              taskId => this.state.tasks[taskId],
            );

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </Container>
        <form onSubmit={this.handleSubmit}>
          <input type="text"/>
          <button>Add Task</button>
        </form>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));