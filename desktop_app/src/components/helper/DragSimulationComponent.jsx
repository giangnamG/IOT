import React, { useEffect, useRef, useState } from 'react';

const DragSimulationComponent = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 }); // Điểm cố định ban đầu
  const dragRef = useRef(null);

  useEffect(() => {
    const handleMouseDown = (event) => {
      // Bắt đầu nhấn giữ chuột tại điểm cố định
      if (event.button === 0) { // Kiểm tra nếu là nút chuột trái
        setIsDragging(true);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        // Di chuyển về phía trái
        setPosition((prevPosition) => ({
          x: prevPosition.x - 5, // Điều chỉnh số điểm di chuyển về phía trái
          y: prevPosition.y,    // Giữ nguyên trên trục y
        }));
      }
    };

    const handleMouseUp = () => {
      // Kết thúc kéo
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Gắn sự kiện mousedown vào điểm cố định
    const element = dragRef.current;
    element.addEventListener('mousedown', handleMouseDown);

    // Cleanup sự kiện khi component unmount
    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div>
      <div
        ref={dragRef}
        style={{
          position: 'absolute',
          top: position.y,
          left: position.x,
          width: '20px',
          height: '20px',
          backgroundColor: 'red',
          cursor: 'pointer',
        }}
      ></div>
      <p>Kéo từ điểm cố định: {`(${position.x}, ${position.y})`}</p>
    </div>
  );
};

export default DragSimulationComponent;
