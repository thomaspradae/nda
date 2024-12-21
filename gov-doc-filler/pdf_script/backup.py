import psycopg2
import PyPDF2
from PyPDF2.generic import NameObject, TextStringObject
import os

# Database connection parameters
db_name = 'gov_doc_filler_base'  # Your database name
db_user = 'postgres'             # Your database username
db_password = 'Warrenzack1' # Use environment variable
db_host = 'localhost'            # Database host
db_port = '5432'                 # Database port

pdf_path = r'gov-doc-filler\pdf_script\form1003.pdf'
output_path = r'gov-doc-filler\pdf_script\filled_form1003.pdf'

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

    # SQL query to fetch your specific columns
    cursor.execute("""
        SELECT 
            name, email, dob_month, dob_day, dob_year, 
            ssn_part1, ssn_part2, ssn_part3, citizenship, marital_status
        FROM submissions
        WHERE id = (SELECT MAX(id) FROM submissions)  -- Adjust as needed
    """)

    # Fetch the result
    row = cursor.fetchone()

    # Check if a row was returned
    if row:
        # Map the result to your field names
        field_data = {
            'name': row[0],
            'email': row[1],
            'dob_month': row[2],
            'dob_day': row[3],
            'dob_year': row[4],
            'ssn_part1': row[5],
            'ssn_part2': row[6],
            'ssn_part3': row[7],
            'citizenship': row[8],
            'marital_status': row[9],
            # Add more fields as necessary
        }
    else:
        print("No data found in the database.")
        field_data = {}

    print("\n###############################################")
    print("Field data retrieved from database:", field_data)
    print("###############################################\n")


    # Close the cursor and connection
    cursor.close()
    conn.close()

    return field_data

db = fetch_field_data()
print(db)

field_mapping = {
    'name': '_1a_Name[0]',
    'email': 'pdf_email_field',
    'dob_month': 'pdf_dob_month_field',
    'dob_day': 'pdf_dob_day_field',
    'dob_year': 'pdf_dob_year_field',
    'ssn_part1': 'pdf_ssn_part1_field',
    'ssn_part2': 'pdf_ssn_part2_field',
    'ssn_part3': 'pdf_ssn_part3_field',
    'citizenship': 'pdf_citizenship_field',
    'marital_status': 'pdf_marital_status_field',
    # Add mappings for all fields you want to populate
}


def map_fields(field_data, field_mapping):
    mapped_data = {}
    for db_field, value in field_data.items():
        if db_field in field_mapping:
            pdf_field = field_mapping[db_field]
            mapped_data[pdf_field] = value
        else:
            print(f"Warning: No PDF field mapping for database field '{db_field}'")
    return mapped_data

mapped_data = map_fields(db, field_mapping)
print("mapped data", mapped_data)

def set_field_values(pdf_path, output_path, field_data):

    #Dictionary to store field names and values 

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

set_field_values(pdf_path, output_path, mapped_data)

# print("program finished")