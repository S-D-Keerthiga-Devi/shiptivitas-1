import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Board from './Board';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Board component', () => {
  it('renders three swimlanes with class Swimlane-column', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(<Board />, div);

    const swimlanes = div.querySelectorAll('.Swimlane-column');
    expect(swimlanes.length).toBe(3);

    const titles = Array.from(div.querySelectorAll('.Swimlane-title')).map(el => el.textContent);
    expect(titles).toEqual(['Backlog', 'In Progress', 'Complete']);

    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('renders all tasks in the backlog swimlane initially', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(<Board />, div);

    const dragColumns = div.querySelectorAll('.Swimlane-dragColumn');
    expect(dragColumns.length).toBe(3);

    const backlogCards = dragColumns[0].querySelectorAll('.Card');
    const inProgressCards = dragColumns[1].querySelectorAll('.Card');
    const completeCards = dragColumns[2].querySelectorAll('.Card');

    expect(backlogCards.length).toBe(20);
    expect(inProgressCards.length).toBe(0);
    expect(completeCards.length).toBe(0);

    backlogCards.forEach(card => {
      expect(card.classList.contains('Card-grey')).toBe(true);
      expect(card.getAttribute('data-status')).toBe('backlog');
    });

    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('updates card color and status when dropped into different swimlanes', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    let boardInstance;
    ReactDOM.render(<Board ref={inst => boardInstance = inst} />, div);

    const backlogColumn = boardInstance.swimlanes.backlog.current;
    const inProgressColumn = boardInstance.swimlanes.inProgress.current;
    const completeColumn = boardInstance.swimlanes.complete.current;

    const card = backlogColumn.querySelector('.Card');

    // Test dropping into In Progress (should turn blue)
    boardInstance.onDrop(card, inProgressColumn, backlogColumn, null);
    expect(card.classList.contains('Card-blue')).toBe(true);
    expect(card.classList.contains('Card-grey')).toBe(false);
    expect(card.getAttribute('data-status')).toBe('in-progress');

    // Test dropping into Complete (should turn green)
    boardInstance.onDrop(card, completeColumn, inProgressColumn, null);
    expect(card.classList.contains('Card-green')).toBe(true);
    expect(card.classList.contains('Card-blue')).toBe(false);
    expect(card.getAttribute('data-status')).toBe('complete');

    // Test dropping back into Backlog (should turn grey)
    boardInstance.onDrop(card, backlogColumn, completeColumn, null);
    expect(card.classList.contains('Card-grey')).toBe(true);
    expect(card.classList.contains('Card-green')).toBe(false);
    expect(card.getAttribute('data-status')).toBe('backlog');

    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });
});
