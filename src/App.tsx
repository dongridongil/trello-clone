import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import Board from './Components/Board';
import { FaRegAddressBook } from 'react-icons/fa6';
import { useState } from 'react';
import Popup from './Components/Popup';

const Wrapper = styled.div`
    display: flex;
    max-width: 680px;
    width: 100%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const CoponentAddButton = styled.div`
    position: fixed;
    width: 50px;
    height: 50px;
    background: radial-gradient(circle, white 1%, rgba(255, 255, 255, 0) 90%);
    border-radius: 50px;
    top: 5%;
    right: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        transform: rotate(0.5turn);
        background-color: #a9fff8;
    }
`;

const Boards = styled.div`
    display: grid;
    width: 100%;
    gap: 10px;
    grid-template-columns: repeat(3, 1fr);
`;

function App() {
    const [toDos, setToDos] = useRecoilState(toDoState);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const onDragEnd = (info: DropResult) => {
        console.log(info.type, '인뽀');
        const { destination, source, draggableId } = info;

        if (!destination) return;
        if (destination?.droppableId === source?.droppableId) {
            //같은 보드에서 움직였다면
            setToDos((allBoards) => {
                const boardCopy = [...allBoards[source.droppableId]];
                const taskObj = boardCopy[source.index];
                boardCopy.splice(source.index, 1);
                ///splice (어느곳에서부터, 몇개까지)
                boardCopy.splice(destination?.index, 0, taskObj);
                return {
                    ...allBoards,
                    [source.droppableId]: boardCopy,
                };
            });
        }

        if (destination.droppableId !== source.droppableId) {
            setToDos((allBoards) => {
                const sourceBoard = [...allBoards[source.droppableId]];
                const taskObj = sourceBoard[source.index];
                const destinationBoard = [...allBoards[destination.droppableId]];
                sourceBoard.splice(source.index, 1);
                destinationBoard.splice(destination?.index, 0, taskObj);
                return {
                    ...allBoards,
                    [source.droppableId]: sourceBoard,
                    [destination.droppableId]: destinationBoard,
                };
            });
        }
    };
    /// 메모 생성부분
    const handleOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    const handleSubmit = (inputValue: any) => {
        if (inputValue == '') return window.alert('빈 값으로 추가할 수 없습니다.');
        setToDos((p) => {
            return {
                ...p,
                [inputValue]: [],
            };
        });
        handleClose();
    };

    return (
        <>
            <Popup isOpen={isModalOpen} onClose={handleClose} onSubmit={handleSubmit} />
            <DragDropContext onDragEnd={onDragEnd}>
                <CoponentAddButton onClick={handleOpen}>
                    <FaRegAddressBook />
                </CoponentAddButton>

                <Wrapper>
                    <Boards>
                        {Object.keys(toDos).map((boardId) => (
                            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
                        ))}
                    </Boards>
                </Wrapper>
            </DragDropContext>
        </>
    );
}
export default App;
