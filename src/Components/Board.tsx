import { Droppable } from 'react-beautiful-dnd';
import DragabbleCard from './DragabbleCard';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ITodo, toDoState } from '../atoms';
import { useSetRecoilState } from 'recoil';
import { IoIosExit } from 'react-icons/io';

const Form = styled.form`
    width: 100%;
    input {
        width: 100%;
    }
`;

const DeleteBtn = styled.button<{ boardId: string }>`
    background-color: transparent;
    border: 0;
    position: absolute;
    cursor: pointer;
`;

const Wrapper = styled.div`
    width: 250px;
    height: 300px;
    padding-top: 10px;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
`;
interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
}
interface IAreaProps {
    isDraggingFromThis: boolean;
    isDraggingOver: boolean;
}
const Area = styled.div<IAreaProps>`
    background-color: ${(props) =>
        props.isDraggingOver ? '#dfe6e9' : props.isDraggingFromThis ? '#b2bec3' : '#74b9ff'};
    flex-grow: 1;
    transition: background-color 0.3s ease-in-out;
    padding: 20px;
`;

const Title = styled.h2`
    text-align: center;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 18px;
`;

interface IForm {
    toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    const setToDos = useSetRecoilState(toDoState);

    const deleteBoard = () => {
        setToDos((allBoards) => {
            const updatedToDos = { ...allBoards };
            delete updatedToDos[boardId];
            return updatedToDos;
        });
    };

    const onSubmit = (del_id: number) => {
        setToDos((allBoards) => {
            return { ...allBoards, [boardId]: allBoards[boardId].filter((item, idx) => idx !== del_id) };
        });
    };

    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid = ({ toDo }: IForm) => {
        const newToDo = {
            id: Date.now(),
            text: toDo,
        };
        setToDos((allBoards) => {
            return {
                ...allBoards,
                [boardId]: [...allBoards[boardId], newToDo],
            };
        });
        setValue('toDo', '');
    };
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <DeleteBtn boardId={boardId} onClick={deleteBoard}>
                <IoIosExit />
            </DeleteBtn>
            <Form onSubmit={handleSubmit(onValid)}>
                <input {...register('toDo', { required: true })} type="text" placeholder={`메모 후 엔터`}></input>
            </Form>
            <Droppable droppableId={boardId}>
                {(magic, info) => (
                    <Area
                        isDraggingOver={info.isDraggingOver}
                        isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                        ref={magic.innerRef}
                        {...magic.droppableProps}
                    >
                        {toDos.map((toDo, index) => (
                            <DragabbleCard
                                key={toDo.id}
                                index={index}
                                toDoId={toDo.id}
                                toDoText={toDo.text}
                                onSubmit={onSubmit}
                            />
                        ))}
                        {magic.placeholder}
                    </Area>
                )}
            </Droppable>
        </Wrapper>
    );
}

export default Board;
