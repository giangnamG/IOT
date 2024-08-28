import config from "../../config";

export const sidebarStyles = {
    sidebar: {
        backgroundColor: config.app.styles.sideBarColor,
        color: '#fff',
        width: '250px',
        height: '100vh', // full height
        position: 'fixed', // giữ thanh sidebar cố định
        top: 0, // đứng đầu trang
        left: 0, // gắn bên trái
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
        zIndex: 1000 // Đảm bảo thanh sidebar nằm trên các phần tử khác
    },
    sidebarContent: {
        flex: 1, // Phần cuộn sẽ chiếm phần còn lại
        overflowY: 'auto', // Cho phép cuộn dọc
    },
    sidebarFooter: {
        backgroundColor: '#343a40',
        color: '#fff',
        borderTop: '1px solid #495057',
    },
    sidebarLink: {
        color: '#adb5bd',
        padding: '10px 20px',
        textDecoration: 'none',
        borderRadius: '15px',
        display: 'block',
        transition: 'background-color 0.6s ease, color 0.5s ease'
    },
    hoverSidebarLink: {
        backgroundColor: '#007bff',
        color: '#fff'
    }
};
