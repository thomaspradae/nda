import psycopg2
import PyPDF2
from PyPDF2.generic import NameObject, TextStringObject
import os
import sys
import re

# Get the submission ID from command-line arguments
if len(sys.argv) > 1:
    submission_id = sys.argv[1]
else:
    print("No submission ID provided.")
    sys.exit(1)

# Database connection parameters
db_name = 'gov_doc_filler_base'
db_user = 'postgres'
db_password = 'Warrenzack1'  # Use environment variables in production
db_host = 'localhost'
db_port = '5432'

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Path to the PDF template
pdf_path = os.path.join(script_dir, 'form1003.pdf')

def fetch_field_data(submission_id):
    """Fetch submission data from the database."""
    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            name, email, dob_month, dob_day, dob_year, 
            ssn_part1, ssn_part2, ssn_part3, citizenship, marital_status
        FROM submissions
        WHERE id = %s
    """, (submission_id,))

    row = cursor.fetchone()
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
    } if row else {}

    cursor.close()
    conn.close()
    return field_data

def map_fields(field_data, field_mapping):
    """Map database fields to PDF fields."""
    mapped_data = {}
    for db_field, value in field_data.items():
        if db_field in field_mapping:
            mapped_data[field_mapping[db_field]] = value
    return mapped_data

def sanitize_filename(name):
    """Sanitize filenames to remove special characters."""
    sanitized_name = re.sub(r'[^A-Za-z0-9 _-]', '', name).replace(' ', '_')
    return sanitized_name

def set_field_values(pdf_path, output_path, field_data):
    """Fill PDF fields with mapped data."""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        writer = PyPDF2.PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        fields = reader.get_fields()
        if fields:
            writer.update_page_form_field_values(
                writer.pages[0], 
                {NameObject(key): TextStringObject(str(value)) for key, value in field_data.items() if value}
            )
            writer._root_object.update({
                NameObject('/NeedAppearances'): PyPDF2.generic.BooleanObject(True)
            })

        with open(output_path, 'wb') as output_file:
            writer.write(output_file)

# Field mapping: database fields -> PDF fields
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
}

# Main Script Execution
field_data = fetch_field_data(submission_id)
mapped_data = map_fields(field_data, field_mapping)

# Sanitize name for the output filename
sanitized_name = sanitize_filename(field_data.get('name', 'unknown'))

# Generate output directory and filename
output_dir = os.path.join(script_dir, 'output_pdfs')
os.makedirs(output_dir, exist_ok=True)

output_filename = f"filled_form_{sanitized_name}_{submission_id}.pdf"
output_path = os.path.join(output_dir, output_filename)

# Fill the PDF and save it
set_field_values(pdf_path, output_path, mapped_data)

# Print the PDF path (ONLY the path for server.js to use)
pdf_relative_path = f"/pdfs/{output_filename}"
print(pdf_relative_path)

# Update the database with the PDF path
try:
    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    cursor = conn.cursor()
    cursor.execute("UPDATE submissions SET pdf_path = %s WHERE id = %s", (pdf_relative_path, submission_id))
    conn.commit()
except Exception as e:
    print(f"Error updating PDF path in database: {e}")
finally:
    cursor.close()
    conn.close()
