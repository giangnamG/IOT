import sqlite3

def column_exists(cursor, table_name, column_name):
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = [column[1] for column in cursor.fetchall()]
    return column_name in columns

# Kết nối với cơ sở dữ liệu SQLite của bạn
conn = sqlite3.connect('./instance/database.sqlite')
cursor = conn.cursor()

# Kiểm tra và thêm các cột nếu chưa tồn tại
columns_to_add = ['dust', 'rain', 'wind']
for column in columns_to_add:
    if not column_exists(cursor, 'data_real_time', column):
        try:
            cursor.execute(f'ALTER TABLE data_real_time ADD COLUMN {column} INTEGER')
            print(f"Đã thêm cột {column} thành công.")
        except sqlite3.OperationalError as e:
            print(f"Lỗi khi thêm cột {column}: {e}")
    else:
        print(f"Cột {column} đã tồn tại.")

# Lưu thay đổi và đóng kết nối
conn.commit()
conn.close()
