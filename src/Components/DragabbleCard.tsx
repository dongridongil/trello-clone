import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { FaTrashCan } from 'react-icons/fa6';

const Card = styled.div<{ isDragging: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 10px 10px;
    background-color: ${(props) => (props.isDragging ? '#74b9ff' : props.theme.cardColor)};
    box-shadow: ${(props) => (props.isDragging ? '0px 2px 10px rgba(0,0,0,0.05)' : 'none')};
`;
const CardTitle = styled.div`
    padding: 5px;
`;

const Button = styled.button<{ id: number }>`
    background: transparent;
    border: 0;
    width: auto;
    padding: 10px;
    cursor: pointer;
`;

interface IDragabbleCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
    onSubmit: (del_id: number) => void;
}
function DragabbleCard({ toDoId, toDoText, index, onSubmit }: IDragabbleCardProps) {
    const onClick = (data: React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget: { id, value },
        } = data;

        onSubmit(+id);
    };
    return (
        <>
            <Draggable draggableId={toDoId + ''} index={index}>
                {(magic, snapshot) => (
                    <Card
                        isDragging={snapshot.isDragging}
                        ref={magic.innerRef}
                        {...magic.dragHandleProps}
                        {...magic.draggableProps}
                    >
                        <CardTitle>{toDoText}</CardTitle>
                        <Button id={index} onClick={onClick}>
                            <FaTrashCan />
                        </Button>
                    </Card>
                )}
            </Draggable>
        </>
    );
}

export default React.memo(DragabbleCard);
