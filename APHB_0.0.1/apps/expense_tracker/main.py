# Import Modules
import sys
import os
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QPushButton, QLineEdit, QComboBox, QDateEdit, QTableWidget, QVBoxLayout, QHBoxLayout, QMessageBox, QTableWidgetItem, QHeaderView
from PyQt5.QtSql import QSqlDatabase, QSqlQuery
from PyQt5.QtCore import QDate, Qt

# App Class
class ExpenseApp(QWidget):
    def __init__(self):
        super().__init__()    
        # Main App Objects & Settings
        self.resize(550, 500)
        self.setWindowTitle("Expense Tracker 2.0")

        self.date_box = QDateEdit()
        self.date_box.setDate(QDate.currentDate())
        self.dropdown = QComboBox()
        self.amount = QLineEdit()
        self.description = QLineEdit()

        self.add_button = QPushButton("Add Expense")
        self.delete_button = QPushButton("Delete Expense")
        self.add_button.clicked.connect(self.add_expense)
        self.delete_button.clicked.connect(self.delete_expense)

        self.table = QTableWidget()
        self.table.setColumnCount(5)
        header_names = ["Id","Date","Category","Amount","Description"]
        self.table.setHorizontalHeaderLabels(header_names) 
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.table.sortByColumn(1, Qt.DescendingOrder)
        # Design App with Layouts

        self.dropdown.addItems(["Food","Transportation","Rent","Shopping","Entertainment","Bills","Other"])

        self.setStyleSheet("""
                                QWidget {
                                    background-color: #b8c9e1;
                                }

                                QLabel {
                                    color: #333;
                                    font-size: 14px;
                                }

                                QLineEdit, QComboBox, QDateEdit, QTableWidget {
                                    background-color: #b8c9e1;
                                    color: #333;
                                    border: 1px solid #444;
                                    padding: 5px;
                                }

                                QTableWidget {
                                    selection-background-color: #ddd;
                                }

                                QPushButton {
                                    background-color: #4caf50;
                                    color: #fff;
                                    border: none;
                                    padding: 8px 16px;
                                    font-size: 14px;
                                }

                                QPushButton:hover {
                                    background-color: #45a049;
                                }

                                QHeaderView::section {
                                    background-color: #b8c9e1;
                                    color: #333;
                                    border: 1px solid #444;
                                    font-size: 14px;
                                }
                            """)

        
        self.master_layout = QVBoxLayout()
        self.row1 = QHBoxLayout()
        self.row2 = QHBoxLayout()
        self.row3 = QHBoxLayout()

        self.row1.addWidget(QLabel("Date:"))
        self.row1.addWidget(self.date_box)
        self.row1.addWidget(QLabel("Category:"))
        self.row1.addWidget(self.dropdown)

        self.row1.addWidget(QLabel("Amount:"))
        self.row1.addWidget(self.amount)
        
        self.row1.addWidget(QLabel("Description"))
        self.row1.addWidget(self.description)

        self.row3.addWidget(self.add_button)
        self.row3.addWidget(self.delete_button) 

        self.master_layout.addLayout(self.row1)
        self.master_layout.addLayout(self.row2)
        self.master_layout.addLayout(self.row3)

        self.master_layout.addWidget(self.table)

        self.setLayout(self.master_layout)

        self.load_table()

    def load_table(self):
        self.table.setRowCount(0)

        query = QSqlQuery("SELECT * FROM expenses")
        row = 0
        while query.next():
            expense_id = query.value(0)
            date = query.value(1)
            category = query.value(2)
            amount = query.value(3)
            description = query.value(4)
            
            # Add values to Table
            self.table.insertRow(row)
            self.table.setItem(row,0,QTableWidgetItem(str(expense_id)))
            self.table.setItem(row,1,QTableWidgetItem(date))
            self.table.setItem(row,2,QTableWidgetItem(str(category)))
            self.table.setItem(row,3,QTableWidgetItem(str(amount)))
            self.table.setItem(row,4,QTableWidgetItem(description))

            row += 1

    def add_expense(self):
        date = self.date_box.date().toString("yyyy-MM-dd")
        category = self.dropdown.currentText()
        amount = self.amount.text()
        description = self.description.text()

        query = QSqlQuery()
        query.prepare("""
                    INSERT INTO expenses (date, category, amount, description)
                    VALUES (?, ?, ?, ?)
                      """)
        query.addBindValue(date)
        query.addBindValue(category)
        query.addBindValue(amount)
        query.addBindValue(description)
        query.exec_()

        self.date_box.setDate(QDate.currentDate())
        self.dropdown.setCurrentIndex(0)
        self.amount.clear()
        self.description.clear()

        self.load_table()

    def delete_expense(self):
        
        selected_row = self.table.currentRow()
        
        if selected_row == -1:
            QMessageBox.warning(self, "No Expese Chosen", "Please choose an expense to delete!")
            return

        expense_id = int(self.table.item(selected_row,0).text())

        confirm = QMessageBox.question(self, "Are you sure?", "Detlete?", QMessageBox.Yes | QMessageBox.No)

        if confirm == QMessageBox.No:
            return
        
        query = QSqlQuery()
        query.prepare("DELETE FROM expenses WHERE id = ?")
        query.addBindValue(expense_id)
        query.exec_()

        self.load_table()

    def closeEvent(self, event):
        # Ensure the database is properly closed when the application exits
        print("Closing the database connection.")
        database.close()
        event.accept()


# Determine the path to the database
if getattr(sys, 'frozen', False):
    # If the application is run as a compiled executable, get the directory of the executable
    app_data_dir = os.path.join(os.environ['APPDATA'], 'ExpenseTracker')
    os.makedirs(app_data_dir, exist_ok=True)
    db_path = os.path.join(app_data_dir, 'expense.db')
else:
    # If the application is run in a normal Python environment, get the directory of the script
    db_path = os.path.join(os.path.dirname(__file__), 'expense.db')

# Create database
database = QSqlDatabase.addDatabase("QSQLITE")
database.setDatabaseName(db_path)  # Use the correct database path here

if not database.open():
    print("Failed to open the database:", database.lastError().text())
    QMessageBox.critical(None, "Error", "Could not open your Database")
    sys.exit(1)

query = QSqlQuery()
query.exec_("""
            CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            category TEXT,
            amount REAL,
            description TEXT
            )
            """)

# Run the App
if __name__ == "__main__":
    app = QApplication([])
    main = ExpenseApp()
    main.show()
    app.exec_()
