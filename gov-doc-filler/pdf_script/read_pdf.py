import psycopg2
import PyPDF2
from PyPDF2.generic import NameObject, TextStringObject

# Database connection parameters
db_name = 'gov_doc_filler_base'  # Replace with your actual database name
db_user = 'postgres'  # Replace with your actual username
db_password = 'Warrenzack1'  # Replace with your actual password
db_host = 'localhost'  # Replace with your actual host, if different
db_port = '5432'  # Default PostgreSQL port

pdf_path = r'gov-doc-filler\pdf_script\form1003.pdf'
output_path = r'gov-doc-filler\pdf_script\filled_form1003.pdf'

# Step 1: Connect to PostgreSQL and Fetch Field Data
def fetch_field_data():
    # Connect to PostgreSQL
    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    cursor = conn.cursor()

    # SQL query to fetch field names and values from the pdf_fields table
    cursor.execute("SELECT field_name, field_value FROM pdf_fields") #Change this to column name 1, column name 2, table name 

    # Fetch all results and store them in a dictionary
    field_data = {row[0]: row[1] for row in cursor.fetchall()}

    # Close the cursor and connection
    cursor.close()
    conn.close()

    return field_data

def set_field_values(pdf_path, output_path, field_data):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        writer = PyPDF2.PdfWriter()

        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            writer.add_page(page)

        fields = reader.get_fields()
        if fields:
            for field_name, field in fields.items():
                if field_name in field_data:
                    writer.update_page_form_field_values(
                        writer.pages[0],
                        {NameObject(field_name): TextStringObject(field_data[field_name])}
                    )
                    print(f"Updated Field: '{field_name}' with value '{field_data[field_name]}'")
                else:
                    print(f"No matching data for field '{field_name}'")

            writer._root_object.update({
                NameObject('/NeedAppearances'): PyPDF2.generic.BooleanObject(True)
            })

        else:
            print("No fields found in the PDF.")

        with open(output_path, 'wb') as output_file:
            writer.write(output_file)

# Step 3: Execute the Complete Workflow
def main():
    # Fetch data from the PostgreSQL database
    field_data = fetch_field_data()
    print("Field data retrieved from database:", field_data)

    # Set field values in the PDF based on the retrieved data
    set_field_values(pdf_path, output_path, field_data)

    print("Program finished")

# Run the main function
if _name_ == "_main_":
    main()