import PyPDF2

pdf_path = r'gov-doc-filler\pdf_script\form1003.pdf'

def get_field_names(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        if reader.is_encrypted:
            reader.decrypt('your_password')  # if the file is encrypted

        fields = reader.get_fields()
        if fields:
            for field_name, field in fields.items():
                print(f"{field_name}: {field.field_type}")

get_field_names(pdf_path)